import express from "express";
import {
  calculateDeliveryPrice,
  calculateDiscountPercentage,
  calculatePriceItems,
  createCollection,
  createProduct,
  createPromoBanner,
  deleteProduct,
  doesCollectionExist,
  editOrder,
  editPromoBanner,
  editUser,
  httpStatusResponse,
  listStates,
  sendEmail,
} from "./helper";
import {
  AdminMessageModel,
  CollectionModel,
  NewLetterModel,
  OrderModel,
  ProductModel,
  ProductSetModel,
  PromoModel,
  StorePromotionModel,
  UserModel,
} from "./model";
import {
  AdminMessage,
  IBanner,
  IBuySet,
  ICollection,
  IFlutterwaveWebHook,
  IGoogleUser,
  IOrder,
  IOrderProducts,
  IProduct,
  IProductFilter,
  IPromotion,
  IUser,
} from "../types";
import { chartColorFills } from "./data";
import axios from "axios";
import { sign } from "jsonwebtoken";
import mongoose from "mongoose";
import {
  failedOrderEmail,
  notifyAdminAboutClaimPaymentEmail,
  successfulOrderEmail,
  underpaidOrderEmail,
} from "./emails";
import { v4 as uuidv4 } from "uuid";

export const authenticateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let _user: IUser;
    const { accessToken } = req.body as { accessToken: string };

    if (!accessToken) {
      return res
        .status(404)
        .json(
          httpStatusResponse(404, "Missing required property (access-token)")
        );
    }

    const googleUser: { data: IGoogleUser } = await axios.get(
      `https://www.googleapis.com/oauth2/v2/userinfo`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!googleUser) {
      return res.status(404).json(httpStatusResponse(404, "User not found."));
    }

    const { email, picture: avatar, given_name } = googleUser.data;

    const user = await UserModel.findOne({ email });

    _user = user;

    if (!user) {
      const u: IUser = {
        name: given_name || email.split("@")[0],
        address: {
          state: "",
          lga: "",
        },
        avatar,
        email,
        recentOrder: {
          orders: 0,
          products: [],
        },
        role: "user",
        totalSpent: 0,
      };

      _user = await UserModel.create(u);
    }

    const newToken = sign(
      { userId: _user.id, userEmail: _user.email, role: _user.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" } // Adjust expiration time as needed
    );

    res.cookie("access-token", newToken, {
      maxAge: 60 * 60 * 24 * 2 * 1000, // Keep it for 2 days
      httpOnly: true,
    });

    return res.status(200).json(
      httpStatusResponse(200, "user authenticated successfully", {
        ..._user,
        token: newToken,
      })
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const getBestSellingProduct = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    // Fetch orders that have been paid
    const paidOrders = await OrderModel.find({
      orderStatus: "Paid",
    });

    // Check if there are any paid orders
    if (paidOrders.length === 0) {
      const products = await ProductModel.aggregate([{ $sample: { size: 1 } }]);
      return res
        .status(200)
        .json(httpStatusResponse(200, "No paid orders found.", products[0]));
    }

    // Create a map to count occurrences of each product ID
    const productCount: Record<string, number> = {};

    // Loop through each order and count the products
    paidOrders.forEach((order) => {
      order.items.forEach((product) => {
        productCount[product._id] = (productCount[product._id] || 0) + 1;
      });
    });

    // Convert the productCount map to an array and find the product with the maximum count
    const bestSellingProductId = Object.keys(productCount).reduce((a, b) =>
      productCount[a] > productCount[b] ? a : b
    );

    // Fetch the best-selling product details from the Product model
    const bestSellingProduct = await ProductModel.findById(
      bestSellingProductId
    );

    // Check if the best-selling product was found
    if (!bestSellingProduct) {
      return res
        .status(404)
        .json(httpStatusResponse(404, "Best-selling product not found."));
    }

    return res
      .status(200)
      .json(httpStatusResponse(200, "", bestSellingProduct));
  } catch (error) {
    console.error("Error fetching best selling product:", error); // Log the error for debugging
    return res
      .status(500)
      .json(httpStatusResponse(500, "Internal Server Error"));
  }
};

export const getLatestDiscountedProduct = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const promo = await PromoModel.find().sort("createdAt").limit(1);

    return res.status(200).json(httpStatusResponse(200, "", promo[0]));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500, undefined));
  }
};

export const getCollections = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const collections = await CollectionModel.find();
    return res.status(200).json(httpStatusResponse(200, "", collections));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500, undefined));
  }
};

export const getCollectionProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { collection } = req.params;
    const { page = 20 } = req.query as unknown as { page?: number };

    const products = await ProductModel.find({ collection }).limit(page);
    const totalProducts = await ProductModel.countDocuments();

    return res
      .status(200)
      .json(httpStatusResponse(200, "", { products, totalProducts }));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500, undefined));
  }
};

export const suggestedForYou = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { category, sample = 7 } = req.query as {
      category?: string;
      sample?: number;
    };

    // Initialize the aggregation pipeline
    const pipeline: any[] = [];

    // Add a match stage to filter by category if the category is provided
    if (category) {
      pipeline.push({ $match: { collection: category } });
    }

    // Add the sample stage to get random products (limit 15)
    pipeline.push({ $sample: { size: sample } });

    // Execute the aggregation pipeline
    const products = await ProductModel.aggregate(pipeline);

    return res.status(200).json(httpStatusResponse(200, "", products));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500, undefined));
  }
};

export const getTopSellers = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const orders = await OrderModel.find({ orderStatus: "Paid" });

    const productIds = orders.flatMap((order) =>
      order.items.map((item) => item._id)
    );

    const products = await ProductModel.find({
      id: { $in: productIds },
    }).limit(20);

    if (products.length === 0) {
      const products = await ProductModel.find().limit(10);
      return res.status(200).json(httpStatusResponse(200, undefined, products));
    }

    return res.status(200).json(httpStatusResponse(200, "", products));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500, undefined));
  }
};

export const getProductSet = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const productSet = await ProductSetModel.findOne({});
    return res.status(200).json(httpStatusResponse(200, "", productSet));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500, undefined));
  }
};

export const getProducts = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      page = 20,
      filter,
      query,
      collection,
    } = req.query as unknown as {
      page?: number;
      filter?: IProductFilter;
      query?: string;
      category?: string;
      collection?: string;
    };

    // Initialize the query options
    let productQuery: any = {};
    let sortOption = {};

    // Handle searching by query if available
    if (query) {
      productQuery = {
        ...productQuery,
        name: { $regex: new RegExp(query, "i") }, // Case insensitive search
      };
    }

    // Handle filtering by collection if available
    if (collection) {
      productQuery = {
        ...productQuery,
        collection, // Filter by collection
      };
    }

    // Handle additional filters if available
    if (filter) {
      switch (filter) {
        case "001":
          sortOption = { price: 1 }; // Sort by price descending
          break;
        case "002":
          sortOption = { price: -1 }; // Sort by price ascending
          break;
        case "003":
          sortOption = { stock: 1 }; // Sort by stock descending
          break;
        default:
          break;
      }
    }

    // Fetch products with pagination, filter, and sorting
    const products = await ProductModel.find(productQuery)
      .sort({ ...sortOption, createdAt: -1 })
      .limit(Number(page))
      .exec();

    // Return the products
    return res.status(200).json(httpStatusResponse(200, "", products));
  } catch (error) {
    console.error("Error fetching products:", error); // Log the error for debugging
    return res
      .status(500)
      .json(httpStatusResponse(500, "Internal Server Error"));
  }
};

export const getProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { productId } = req.params;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json(
          httpStatusResponse(
            404,
            "Product with this Id does not exist in our database"
          )
        );
    }

    return res.status(200).json(httpStatusResponse(200, "", product));
  } catch (error) {
    return res
      .status(500)
      .json(httpStatusResponse(500, "Internal Server Error"));
  }
};

export const _calculatePriceItems = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { productIds } = req.body as { productIds: string[] };

    const products = await ProductModel.find({ _id: { $in: productIds } });

    // Map products by their ID for easy access
    const productMap: Record<string, IProduct> = {};
    products.forEach((product) => {
      productMap[product.id] = product;
    });

    // Populate `_items` array based on how many times each ID appears
    const _items = productIds.map((id) => productMap[id]);

    const totalAmount = await calculatePriceItems(_items);

    return res.status(200).json(httpStatusResponse(200, "", { totalAmount }));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(httpStatusResponse(500, "Internal Server Error"));
  }
};

export const cancelOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { orderId } = req.params;

    await OrderModel.findByIdAndUpdate(orderId, { orderStatus: "Cancelled" });

    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          `Order ${orderId} has been cancelled successfully`
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(httpStatusResponse(500, "Internal Server Error"));
  }
};

export const getStates = async (_: express.Request, res: express.Response) => {
  try {
    const availableStatesForDelivery = listStates();

    return res
      .status(200)
      .json(httpStatusResponse(200, undefined, availableStatesForDelivery));
  } catch (error) {
    console.log(error);
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const _calculateDeliveryPrice = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { state, quantity = 1 } = req.query as unknown as {
      state: string;
      quantity: number;
    };

    const price = calculateDeliveryPrice(state) * Number(quantity);

    return res.status(200).json(httpStatusResponse(200, undefined, { price }));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const userClaimsToHaveMakePayment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { orderId } = req.body;

    // Validate orderId
    if (!orderId) {
      return res
        .status(400)
        .json(httpStatusResponse(400, "Order ID is required"));
    }

    // Find the order
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json(httpStatusResponse(404, "Order not found"));
    }

    // Update order status
    order.paymentStatus = "Pending";
    await order.save();

    // Notify admin
    await sendEmail(
      process.env.HOST_EMAIL,
      notifyAdminAboutClaimPaymentEmail(order)
    );

    // Respond to user
    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          "Payment claim received. Our team will verify the payment shortly."
        )
      );
  } catch (error) {
    console.error("Error in userClaimsToHaveMakePayment:", error);
    return res.status(500).json(httpStatusResponse(500));
  }
};

//These routes are protected --> users && admin
export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, userEmail } = req.user;

    // Find the user by userId
    let user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json(httpStatusResponse(404, "User not found"));
    }

    // Get the recent orders (limit to 5)
    const recentOrders = await OrderModel.find({
      "customer.email": userEmail,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get the count of all recent orders
    const recentOrderCount = await OrderModel.countDocuments({
      "customer.email": userEmail,
    });

    // Update the user's recent orders
    user = await UserModel.findOneAndUpdate(
      { email: userEmail },
      {
        $set: {
          "recentOrder.products": recentOrders,
          "recentOrder.orders": recentOrderCount,
        },
      },
      { new: true } // Return the updated document
    );

    // Return the updated user details
    return res.status(200).json(httpStatusResponse(200, "", user.toObject()));
  } catch (error) {
    console.error("Error fetching user or recent orders:", error);
    return res
      .status(500)
      .json(httpStatusResponse(500, "Internal Server Error"));
  }
};

export const getRecentOrders = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(6);

    return res.status(200).json(httpStatusResponse(200, "", orders));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

//Query --> asAdmin, page
export const getOrderHistories = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    // Parse the query parameters and explicitly convert asAdmin to a boolean
    const { page, asAdmin } = req.query as unknown as {
      page?: number;
      asAdmin?: string;
    };

    // Convert asAdmin to a boolean (if it's 'true', set it to true, otherwise false)
    const isAdmin = asAdmin === "true";

    const { userEmail, role } = req.user;

    if (isAdmin && ["admin", "superuser"].includes(role)) {
      const orders = await OrderModel.find()
        .sort({ createdAt: -1 })
        .limit(Number(page));

      return res.status(200).json(httpStatusResponse(200, "", orders));
    }

    const orders = await OrderModel.find({ "customer.email": userEmail })
      .sort({ createdAt: -1 })
      .limit(Number(page));

    return res.status(200).json(httpStatusResponse(200, "", orders));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

//Param --> orderId
export const getOrder = async (req: express.Request, res: express.Response) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);
    return res.status(200).json(httpStatusResponse(200, "", order.toObject()));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500, undefined));
  }
};

export const expenseInsight = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.user;

    const collections = [
      {
        image: "",
        name: "Luggages",
        slug: "luggages",
        remainingInStock: 0,
      },
      {
        image: "",
        name: "Electronics",
        slug: "electronics",
        remainingInStock: 20,
      },
      {
        image: "",
        name: "Clothing",
        slug: "clothing",
        remainingInStock: 50,
      },
      {
        image: "",
        name: "Footwear",
        slug: "footwear",
        remainingInStock: 30,
      },
      {
        image: "",
        name: "Accessories",
        slug: "accessories",
        remainingInStock: 15,
      },
      {
        image: "",
        name: "Home Goods",
        slug: "home-goods",
        remainingInStock: 10,
      },
    ];
    //
    const allItems = (
      await OrderModel.find({ userId, orderStatus: "Paid" })
    ).flatMap((order) => order.items);

    // Step 2: Group by category and accumulate amountSpent
    const categorySpending = allItems.reduce((acc, item) => {
      const { collection, price, hasDiscount, discountedPrice } = item;
      // If the category already exists in the accumulator, add to the total
      if (acc[collection]) {
        acc[collection] += price;
      } else {
        // If not, initialize the category with the amountSpent
        acc[collection] = price;
      }
      return acc;
    }, {} as Record<string, number>);

    // Step 3: Format the result into an array of objects
    const result = collections.map((collection, idx) => ({
      collection: collection.slug,
      amountSpent: categorySpending[collection.slug] || 0,
      fill: chartColorFills[idx],
    }));

    const totalSpent = result.reduce((acc, curr) => acc + curr.amountSpent, 0);

    return res
      .status(200)
      .json(
        httpStatusResponse(200, "", { totalSpent, expenseInsight: result })
      );
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

export const createNewOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      address,
      customer,
      products: _products,
    } = req.body as IOrder & {
      products: { color: string; ids: string }[];
    };

    // Query for user's pending orders
    const userOrders = await OrderModel.find({
      orderStatus: "Pending",
      email: customer.email,
    }).sort({ createdAt: -1 }); // Sort by most recent first

    // Check if the user has more than 3 pending orders and cancel excess ones
    if (userOrders.length > 3) {
      const ordersToCancel = userOrders.slice(3).map((order) => order._id);

      // Update the excess pending orders to "Cancelled"
      await OrderModel.updateMany(
        { _id: { $in: ordersToCancel } },
        { $set: { orderStatus: "Cancelled" } }
      );
    }

    const productIds = _products.map((product) => product.ids);

    if (!productIds.length) {
      return res
        .status(400)
        .json(
          httpStatusResponse(400, "Cannot create an order without an item")
        );
    }

    // Fetch the products based on the provided IDs
    const products = await ProductModel.find({ _id: { $in: productIds } });

    if (!products.length) {
      return res
        .status(400)
        .json(httpStatusResponse(400, "No valid products found for the order"));
    }

    // Map products by their ID for easy access
    const productMap: Record<string, IProduct> = {};
    products.forEach((product) => {
      productMap[product._id] = product.toObject();
    });

    // Build the items array for the order
    const items: IOrderProducts = _products.map((product) => ({
      colorPrefrence: product.color,
      ...productMap[product.ids], // Assign product details by ID
    }));

    const deliveryFee = calculateDeliveryPrice(address.state) * items.length;
    if (!deliveryFee) {
      return res
        .status(400)
        .json(
          httpStatusResponse(400, "Delivery to this location is not supported")
        );
    }

    const totalPrice = await calculatePriceItems(items);

    // Calculate the total amount for the order
    const totalAmount = totalPrice + deliveryFee;

    // Create the new order with a temporary paymentLink
    const order = new OrderModel({
      address,
      items,
      orderDate: new Date(),
      paymentStatus: "Pending",
      totalAmount,
      deliveryFee,
      customer,
      orderStatus: "Pending",
      paymentLink: "pending",
    });

    const newOrder = await order.save(); // Save the order

    // Prepare the payment payload
    const checkoutPayload = {
      tx_ref: newOrder._id, // Use the order ID as tx_ref
      amount: totalAmount,
      currency: "NGN",
      redirect_url: `${process.env.CLIENT_DOMAIN}/track-order/${newOrder._id}`,
      customer: {
        email: customer.email,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
      },
      session_duration: 1440 * 2, // 2-day session duration
      max_retry_attempt: 5,
      meta: newOrder.toObject(), // Add the order meta details
    };

    // Initiate payment using Flutterwave
    const resp = await axios.post(
      `https://api.flutterwave.com/v3/payments`,
      checkoutPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    // Update the order with the actual payment link
    newOrder.paymentLink = resp.data.data.link;
    await newOrder.save(); // Save the order again with the updated paymentLink

    await UserModel.findOneAndUpdate(
      { email: customer.email },
      { $inc: { "recentOrder.orders": 1 } }
    );

    const { orderConfirmationEmail } = successfulOrderEmail(order);

    await sendEmail(customer.email, orderConfirmationEmail);

    // Return success response
    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          `Your order has been created successfully, Order Id: ${newOrder._id}`,
          newOrder.toObject()
        )
      );
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json(httpStatusResponse(500, error.message));
  }
};

//These routes are just for the admin --> admin
export const addNewProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      availableColors,
      collection,
      description,
      hasDiscount,
      discountedPrice,
      price,
      stock,
      name,
      imgs,
      editMode,
      productId,
    } = req.body as IProduct & { productId?: string; editMode?: string };

    if (!name) {
      return res
        .status(404)
        .json(httpStatusResponse(400, "Missing required parameter (Name)"));
    }

    if (availableColors.length === 0) {
      return res
        .status(404)
        .json(httpStatusResponse(404, "Missing available product colors"));
    }

    if (!(await doesCollectionExist(collection))) {
      return res
        .status(400)
        .json(httpStatusResponse(400, "Invalid collection type"));
    }

    if (hasDiscount && !discountedPrice) {
      return res
        .status(400)
        .json(httpStatusResponse(400, "discounted price is required."));
    }

    if (editMode && !productId) {
      return res
        .status(404)
        .json(
          httpStatusResponse(404, "Missing required property (Product Id)")
        );
    }

    if (stock <= 0) {
      return res
        .status(404)
        .json(httpStatusResponse(404, "Missing required property (Stock)"));
    }

    const discountedPercentage = hasDiscount
      ? calculateDiscountPercentage(price, discountedPrice)
      : null;

    const product: IProduct = {
      availableColors,
      collection,
      description,
      discountedPrice,
      hasDiscount,
      imgs,
      name,
      isNew: true,
      price,
      rating: 2,
      stock,
      discountedPercentage,
    };

    const newProduct = editMode
      ? await ProductModel.findByIdAndUpdate(productId, product)
      : await createProduct(product);

    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          editMode
            ? `Product ${newProduct._id} has been updated successfully.`
            : "New Product added to collection",
          newProduct.toObject()
        )
      );
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

export const createCategory = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { image, name, slug } = req.body as ICollection;

    if (!image) {
      return res
        .status(404)
        .json(httpStatusResponse(404, "Missing required property (Image)."));
    }

    if (!(name && slug)) {
      return res
        .status(404)
        .json(httpStatusResponse(404, "Missing required property (Name)."));
    }

    const collection: ICollection = {
      image,
      name,
      remainingInStock: 0,
      slug,
    };

    const newCollection = await createCollection(collection);

    return res
      .status(200)
      .json(httpStatusResponse(200, "", newCollection.toObject()));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

export const _deleteProduct = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { productId } = req.params;
    await deleteProduct(productId);
    return res.status(200).json(httpStatusResponse(200, "", {}));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

export const editAddress = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId, role } = req.user;
    const { state, lga, userId: uid, asAdmin } = req.body;

    if (!(state && lga)) {
      return res
        .status(400)
        .json(httpStatusResponse(400, "Missing required parameter"));
    }

    const update = {
      "address.state": state,
      "address.lga": lga,
    };

    if (asAdmin && role === "user") {
      return res
        .status(401)
        .json(
          httpStatusResponse(401, "You are not allow to make this request")
        );
    }

    const user = await editUser(
      role === "user" ? userId : uid || userId,
      update
    );

    return res.status(200).json(httpStatusResponse(200, "", user.toObject()));
  } catch (error) {
    console.log(error);
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

export const getUsers = async (req: express.Request, res: express.Response) => {
  try {
    const { page = 20, query } = req.query as unknown as {
      page?: number;
      query?: string;
    };

    let searchQuery = {};

    if (query) {
      searchQuery = {
        $or: [
          {
            _id: mongoose.Types.ObjectId.isValid(query)
              ? new mongoose.Types.ObjectId(query)
              : null,
          }, // Check if it's a valid ObjectId
          { email: { $regex: query, $options: "i" } }, // Case-insensitive search for email
          { name: { $regex: query, $options: "i" } }, // Case-insensitive search for name
        ],
      };
    }

    const users = await UserModel.find(searchQuery)
      .sort("createdAt")
      .limit(Number(page));

    const totalUsers = await UserModel.countDocuments();

    return res
      .status(200)
      .json(httpStatusResponse(200, "", { users, totalUsers }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;

    await UserModel.findByIdAndDelete(userId);
    await OrderModel.deleteMany({ userId });

    return res
      .status(200)
      .json(httpStatusResponse(200, `User-${userId} has been deleted`, {}));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

export const getDashboardContent = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    // Get the current date
    const now = new Date();

    // Start of the current month in milliseconds since Unix epoch
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).getTime();

    // End of the current month in milliseconds since Unix epoch
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    ).getTime();

    // Start and end of the previous month
    const startOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    ).getTime();

    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999
    ).getTime();

    // Start of this week (Monday)
    const startOfThisWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + 1)
    ).setHours(0, 0, 0, 0);

    // End of this week (Sunday)
    const endOfThisWeek = new Date(
      now.setDate(now.getDate() - now.getDay() + 7)
    ).setHours(23, 59, 59, 999);

    // Start and end of last week
    const startOfLastWeek = new Date(
      now.setDate(now.getDate() - now.getDay() - 6)
    ).setHours(0, 0, 0, 0);

    const endOfLastWeek = new Date(
      now.setDate(now.getDate() - now.getDay())
    ).setHours(23, 59, 59, 999);

    // Get the total revenue
    const revenue = (await OrderModel.find({ paymentStatus: "Paid" })).reduce(
      (acc, curr) => acc + curr.totalAmount,
      0
    );

    // Get the total number of users
    const users = await UserModel.countDocuments();

    // Get the total users registered this month
    const thisMonthUsers = await UserModel.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    }).countDocuments();

    // Get sales for the current month
    const salesThisMonth = await OrderModel.find({
      orderDate: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
      paymentStatus: "Paid",
    });

    const thisMonthSales = salesThisMonth.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0
    );

    // Get sales for the previous month
    const salesLastMonth = await OrderModel.find({
      orderDate: {
        $gte: startOfLastMonth,
        $lte: endOfLastMonth,
      },
      paymentStatus: "Paid",
    });

    const lastMonthSales = salesLastMonth.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0
    );

    // Calculate percentage increase or decrease in sales for the month
    let salesChangePercentage = 0;

    if (lastMonthSales > 0) {
      salesChangePercentage =
        ((thisMonthSales - lastMonthSales) / lastMonthSales) * 100;
    } else if (thisMonthSales > 0) {
      salesChangePercentage = 100; // If there were no sales last month, any sales this month is a 100% increase
    }

    // Get sales for this week
    const salesThisWeek = await OrderModel.find({
      orderDate: {
        $gte: startOfThisWeek,
        $lte: endOfThisWeek,
      },
      paymentStatus: "Paid",
    });

    const thisWeekSales = salesThisWeek.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0
    );

    // Get sales for last week
    const salesLastWeek = await OrderModel.find({
      orderDate: {
        $gte: startOfLastWeek,
        $lte: endOfLastWeek,
      },
      paymentStatus: "Paid",
    });

    const lastWeekSales = salesLastWeek.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0
    );

    // Calculate percentage increase or decrease in sales for the week
    let weeklySalesChangePercentage = 0;

    if (lastWeekSales > 0) {
      weeklySalesChangePercentage =
        ((thisWeekSales - lastWeekSales) / lastWeekSales) * 100;
    } else if (thisWeekSales > 0) {
      weeklySalesChangePercentage = 100; // If there were no sales last week, any sales this week is a 100% increase
    }

    return res.status(200).json(
      httpStatusResponse(200, "", {
        revenue,
        users,
        thisMonthSales,
        thisMonthUsers,
        salesChangePercentage,
        thisWeekSales,
        weeklySalesChangePercentage,
      })
    );
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const getSalesOverview = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Aggregate sales data by month for the current year
    const salesData = await OrderModel.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`),
          },
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: { $month: "$orderDate" },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Map the aggregated sales data to match the desired format
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const salesOverview = monthNames.map((month, index) => {
      const monthData = salesData.find((data) => data._id === index + 1);
      return {
        name: month,
        total: monthData ? monthData.totalSales : 0,
      };
    });

    return res.status(200).json(httpStatusResponse(200, "", salesOverview));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const assignModerator = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    await editUser(userId, {
      role:
        user.role === "user"
          ? "admin"
          : user.role === "admin"
          ? "user"
          : "user",
    });

    return res
      .status(200)
      .json(
        httpStatusResponse(200, `User-${userId} as been made an admin`, {})
      );
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

export const _editOrder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { orderId } = req.params;
    const order = req.body;
    //
    const newOrder = await editOrder(orderId, order);
    return res
      .status(200)
      .json(httpStatusResponse(200, "", newOrder.toObject()));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(httpStatusResponse(500)));
  }
};

export const sendMessageToUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { message, title } = req.body as AdminMessage;

    // Validation
    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    // Check if there is an existing admin message
    const adminMessage = await AdminMessageModel.findOne({}); // Assuming you want to find any existing message

    if (adminMessage) {
      // Update the existing message if found
      await adminMessage.updateOne({
        title,
        message,
        createdAt: Date.now(),
        id: uuidv4(),
      });
    } else {
      // Create a new admin message if none exists
      await AdminMessageModel.create({
        id: uuidv4(),
        title,
        message,
        createdAt: Date.now(),
      });
    }

    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          "User message has been sent and will soon be delivered",
          {}
        )
      );
  } catch (error) {
    console.error("Error sending message:", error); // Log the error for debugging
    return res
      .status(500)
      .json(httpStatusResponse(500, "Internal Server Error"));
  }
};

export const deleteMessage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { messageId } = req.params; // Assuming you're passing messageId in the URL params

    // Delete the message based on the provided messageId
    const result = await AdminMessageModel.deleteOne({ _id: messageId });

    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json(httpStatusResponse(404, "Message not found", {}));
    }

    return res
      .status(200)
      .json(httpStatusResponse(200, "Message deleted successfully", {}));
  } catch (error) {
    console.error("Error deleting message:", error); // Log the error for debugging
    return res
      .status(500)
      .json(httpStatusResponse(500, "Internal Server Error"));
  }
};

export const recievePayment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      data: { id, status, meta, amount, customer, processor_response },
    } = req.body as IFlutterwaveWebHook;
    const secretHash = process.env.FLUTTERWAVE_SECRET_KEY!;
    const flwSignature = req.headers["verif-hash"];

    if (!flwSignature || flwSignature !== secretHash) {
      return res
        .status(401)
        .json(
          httpStatusResponse(401, "You are not allow to make this request")
        );
    }

    if (status === "successful") {
      if (amount < meta.totalAmount) {
        await sendEmail(
          customer.email,
          underpaidOrderEmail(meta, amount),
          "suleimaangee@gmail.com"
        );
        return res.status(200).json(httpStatusResponse(200));
      }
      //

      const resp: IFlutterwaveWebHook = await axios.get(
        `https://api.flutterwave.com/v3/transactions/${id}/verify`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        }
      );

      if (
        resp.data.status === "successful" &&
        resp.data.amount === meta.totalAmount
      ) {
        const order = await OrderModel.findOneAndUpdate(
          { _id: meta._id },
          { paymentStatus: "Paid" },
          { new: true }
        );

        const productIds = meta.items.map((item) => item._id);

        // Decrease the stock by 1 for each product
        await ProductModel.updateMany(
          { _id: { $in: productIds } },
          { $inc: { stock: -1 } } // Decrease the stock by 1
        );

        const { paymentReceivedEmail } = successfulOrderEmail(order);

        await sendEmail(paymentReceivedEmail, "zaliyasule@gmail.com");

        return res
          .status(200)
          .json(httpStatusResponse(200, "Payment recieved successfully"));
      }

      return res.status(401).json(httpStatusResponse(401));
    }

    if (status === "failed") {
      await sendEmail(
        customer.email,
        failedOrderEmail(meta, processor_response)
      );
      return res.status(200);
    }

    return res.status(400).json(httpStatusResponse(400));
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const createOrEditStorePromotion = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      discountPercentage,
      applicableTo,
      productIds,
      startDate,
      endDate,
      isActive,
    }: IPromotion = req.body;

    // Validation (Basic example)
    if (!discountPercentage || !applicableTo || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the existing promotion
    let promotion = await StorePromotionModel.findOne({});

    if (applicableTo === "SelectedProducts" && productIds.length === 0) {
      return res
        .status(400)
        .json(
          httpStatusResponse(
            400,
            "Please select a product to apply this discount to."
          )
        );
    }

    const activeStatus = isActive;

    if (promotion) {
      // Update existing promotion
      promotion.discountPercentage = discountPercentage;
      promotion.applicableTo = applicableTo;
      promotion.productIds =
        applicableTo === "SelectedProducts" ? productIds : [];
      promotion.startDate = startDate;
      promotion.endDate = endDate;
      promotion.isActive = activeStatus;
    } else {
      // Create a new promotion
      promotion = new StorePromotionModel({
        discountPercentage,
        applicableTo,
        productIds: applicableTo === "SelectedProducts" ? productIds : [],
        startDate,
        endDate,
        isActive: activeStatus,
      });
    }

    // Save the promotion (create or update)
    await promotion.save();

    res
      .status(200)
      .json(httpStatusResponse(200, "Promotion saved successfully", promotion));
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getStorePromotion = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const storePromotion = await StorePromotionModel.findOne({});

    const productIds = storePromotion?.productIds || [];

    const products = await ProductModel.find({ _id: { $in: productIds } });

    res.status(200).json(
      httpStatusResponse(200, "Promotion saved successfully", {
        ...storePromotion?.toObject(),
        products,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(httpStatusResponse(500));
  }
};

export const getAdminMessage = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const adminMessage = await AdminMessageModel.findOne({});

    res.status(200).json(httpStatusResponse(200, undefined, adminMessage));
  } catch (error) {
    res.status(500).json(httpStatusResponse(500));
  }
};

export const createOrEditBuySet = async (
  req: express.Request,
  res: express.Response
) => {
  const { completeSetId, productIds }: IBuySet = req.body;

  try {
    const completeSet = await ProductModel.findById(completeSetId);

    if (!completeSet) {
      return res
        .status(400)
        .json(httpStatusResponse(400, "Invalid completed set ID"));
    }

    for (const i in productIds) {
      const product = await ProductModel.findById(productIds[i]);

      if (!product) {
        return res
          .status(400)
          .json(httpStatusResponse(400, "Invalid product ID found."));
      }
    }

    let sets = await ProductSetModel.findOne({});

    if (sets) {
      sets.completeSetId = completeSetId;
      sets.productIds = productIds;
    } else {
      sets = new ProductSetModel({
        completeSetId,
        productIds,
      });
    }

    await sets.save();
    res.status(200).json({ message: "Buy set saved successfully", sets });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getBuySet = async (_: express.Request, res: express.Response) => {
  try {
    const buySet = await ProductSetModel.findOne({});

    const completeSet = await ProductModel.findById(buySet?.completeSetId);

    const products = await ProductModel.find({
      _id: { $in: buySet?.productIds || [] },
    });

    res
      .status(200)
      .json(httpStatusResponse(200, undefined, { completeSet, products }));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const _createPromoBanner = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { message, description, productId } = req.body;

    const banner = await PromoModel.findOne({});

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(400)
        .json(
          httpStatusResponse(400, "No product with this Id in our database.")
        );
    }

    const _banner: IBanner = {
      description,
      message,
      productId,
    };

    if (!banner) {
      await createPromoBanner(_banner);
    } else {
      await editPromoBanner(banner?.id!, _banner);
    }

    return res
      .status(200)
      .json(
        httpStatusResponse(200, "Your banner has been created successfully")
      );
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const getPromoBanner = async (
  _: express.Request,
  res: express.Response
) => {
  try {
    const banner = await PromoModel.findOne({});

    const product = await ProductModel.findById(banner.productId);

    return res
      .status(200)
      .json(
        httpStatusResponse(200, undefined, { product, ...banner.toObject() })
      );
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const sendOrderReminder = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json(httpStatusResponse(404, "Order with this Id not found"));
    }

    if (order.orderStatus === "Cancelled") {
      return res
        .status(400)
        .json(httpStatusResponse(400, "User already cancelled the order"));
    }

    const email = successfulOrderEmail(order);

    await sendEmail(order.customer.email, email.orderReminderEmail);

    res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          `Reminder about order ${orderId} has been sent to the customer.`
        )
      );
  } catch (error) {
    return res.status(500).json(httpStatusResponse(500));
  }
};

export const joinNewsLetter = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;

    const isValidEmail = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);

    if (!(email && isValidEmail))
      return res
        .status(400)
        .json(httpStatusResponse(400, "Valid email is required"));

    const isExisting = await NewLetterModel.findOne({ email });

    if (isExisting) {
      return res
        .status(409)
        .json(httpStatusResponse(409, "You already join the news-letter"));
    }

    await NewLetterModel.create({ email });

    return res
      .status(200)
      .json(
        httpStatusResponse(
          200,
          "You have successfully joined our new-letter, Thank you"
        )
      );
  } catch (error) {
    console.log(error);
    return res.status(500).json(httpStatusResponse(500));
  }
};
//
