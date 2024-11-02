import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  AdminMessage,
  IBanner,
  ICollection,
  IOrder,
  IProduct,
  IPromotion,
  IUser,
} from "../types";
import {
  AdminMessageModel,
  CollectionModel,
  OrderModel,
  ProductModel,
  PromoModel,
  StorePromotionModel,
  UserModel,
} from "./model";
import express from "express";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { nigeriaStateData } from "./data";

dotenv.config();

export const openConnectionPool = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "", {
      maxPoolSize: 10,
      tls: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error; // Rethrow the error to handle it further up the call stack if needed
  }
};

export const httpStatusResponse = (
  code: number,
  message?: string,
  data?: {}
) => {
  const status: Record<number, any> = {
    200: {
      status: "success",
      message: message || "Request successful",
      data,
    },
    400: {
      status: "bad request",
      message: message || "An error has occurred on the client side.",
      data,
    },
    401: {
      status: "unauthorized access",
      message:
        message ||
        "You are not authorized to make this request or access this endpoint",
      data,
    },
    404: {
      status: "not found",
      message:
        message ||
        "The resources you are looking for cannot be found or does not exist",
      data,
    },
    409: {
      status: "conflict",
      message:
        message ||
        "The resources you are requesting for is having a conflict with something, please message us if this issue persist",
      data,
    },
    429: {
      status: "too-many-request",
      message:
        message || "Please wait again later, you are sending too many request.",
      data,
    },
    500: {
      status: "server",
      message:
        message ||
        "Sorry, The problem is from our end please try again later or message us if this issue persist, sorry for the inconvenience",
      data,
    },
  };

  return status[code];
};

// These helpers are for managing product-related operations

/**
 * Creates a new product and returns the created product document.
 * @param product - The product object to create.
 * @returns The created product document.
 */
export const createProduct = async (product: IProduct) => {
  const newProduct = await ProductModel.create(product);
  return newProduct; // Return the created product
};

/**
 * Updates an existing product by its ID and returns the updated product.
 * @param productId - The ID of the product to update.
 * @param update - A record of fields to update.
 * @returns The updated product document.
 */
export const editProduct = async (
  productId: string,
  update: Record<string, any>
) => {
  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    { $set: update },
    { new: true } // Ensure the updated document is returned
  );
  return updatedProduct; // Return the updated product
};

/**
 * Deletes a product by its ID and returns the deleted product.
 * @param productId - The ID of the product to delete.
 * @returns The deleted product document.
 */
export const deleteProduct = async (productId: string) => {
  const deletedProduct = await ProductModel.findByIdAndDelete(productId);
  return deletedProduct; // Return the deleted product
};

// These helpers are for managing user-related operations

/**
 * Creates a new user and returns the created user document.
 * @param user - The user object to create.
 * @returns The created user document.
 */
export const createUser = async (user: IUser) => {
  const newUser = await UserModel.create(user);
  return newUser; // Return the created user
};

/**
 * Updates an existing user by their ID and returns the updated user.
 * @param userId - The ID of the user to update.
 * @param update - A record of fields to update.
 * @returns The updated user document.
 */
export const editUser = async (userId: string, update: Record<string, any>) => {
  try {
    // Log the update operation for debugging

    // Find and update the user
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: update },
      { new: true, runValidators: true } // runValidators ensures schema validation
    );

    // If user is not found
    if (!updatedUser) {
      throw new Error(`No user found with ID: ${userId}`);
    }

    console.log("Successfully updated user:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error("Failed to update user");
  }
};

/**
 * Deletes a user by their ID and returns the deleted user document.
 * @param userId - The ID of the user to delete.
 * @returns The deleted user document.
 */
export const deleteUser = async (userId: string) => {
  const deletedUser = await UserModel.findByIdAndDelete(userId);
  return deletedUser; // Return the deleted user
};

// These helpers are for managing order-related operations

/**
 * Creates a new order and returns the created order document.
 * @param order - The order object to create.
 * @returns The created order document.
 */
export const createOrder = async (order: IOrder) => {
  const newOrder = await OrderModel.create(order);
  return newOrder; // Return the created order
};

/**
 * Updates an existing order by its ID and returns the updated order.
 * @param orderId - The ID of the order to update.
 * @param update - A record of fields to update.
 * @returns The updated order document.
 */
export const editOrder = async (
  orderId: string,
  update: Record<string, any>
) => {
  const updatedOrder = await OrderModel.findByIdAndUpdate(
    orderId,
    update,
    { new: true } // Ensure the updated document is returned
  );

  if (updatedOrder.orderStatus === "Shipped") {
    //Send email to user that item has been shipped;
  }

  return updatedOrder; // Return the updated order
};

/**
 * Deletes an order by its ID and returns the deleted order document.
 * @param orderId - The ID of the order to delete.
 * @returns The deleted order document.
 */
export const deleteOrder = async (orderId: string) => {
  const deletedOrder = await OrderModel.findByIdAndDelete(orderId);
  return deletedOrder; // Return the deleted order
};

// Store Promotion Helpers

/**
 * Creates a new store promotion and returns the created promotion document.
 * @param promotion - The promotion object to create.
 * @returns The created promotion document.
 */
export const createStorePromotion = async (promotion: IPromotion) => {
  const newPromotion = await StorePromotionModel.create(promotion);
  return newPromotion; // Return the created promotion
};

/**
 * Updates an existing store promotion by its ID and returns the updated promotion.
 * @param promotionId - The ID of the promotion to update.
 * @param update - A record of fields to update.
 * @returns The updated promotion document.
 */
export const editStorePromotion = async (
  promotionId: string,
  update: Record<string, any>
) => {
  const updatedPromotion = await StorePromotionModel.findByIdAndUpdate(
    promotionId,
    { $set: update },
    { new: true } // Ensure the updated document is returned
  );
  return updatedPromotion; // Return the updated promotion
};

/**
 * Deletes a store promotion by its ID and returns the deleted promotion document.
 * @param promotionId - The ID of the promotion to delete.
 * @returns The deleted promotion document.
 */
export const deleteStorePromotion = async (promotionId: string) => {
  const deletedPromotion = await StorePromotionModel.findByIdAndDelete(
    promotionId
  );
  return deletedPromotion; // Return the deleted promotion
};

// Promo Banner Helpers

/**
 * Creates a new promo banner and returns the created banner document.
 * @param banner - The banner object to create.
 * @returns The created banner document.
 */
export const createPromoBanner = async (banner: IBanner) => {
  const newBanner = await PromoModel.create(banner);
  return newBanner; // Return the created banner
};

/**
 * Updates an existing promo banner by its ID and returns the updated banner.
 * @param bannerId - The ID of the banner to update.
 * @param update - A record of fields to update.
 * @returns The updated banner document.
 */
export const editPromoBanner = async (
  bannerId: string,
  update: Record<string, any>
) => {
  const updatedBanner = await PromoModel.findByIdAndUpdate(
    bannerId,
    { $set: update },
    { new: true } // Ensure the updated document is returned
  );
  return updatedBanner; // Return the updated banner
};

/**
 * Deletes a promo banner by its ID and returns the deleted banner document.
 * @param bannerId - The ID of the banner to delete.
 * @returns The deleted banner document.
 */
export const deletePromoBanner = async (bannerId: string) => {
  const deletedBanner = await PromoModel.findByIdAndDelete(bannerId);
  return deletedBanner; // Return the deleted banner
};

// Collection Helpers

/**
 * Creates a new collection and returns the created collection document.
 * @param collection - The collection object to create.
 * @returns The created collection document.
 */
export const createCollection = async (collection: ICollection) => {
  const newCollection = await CollectionModel.create(collection);
  return newCollection; // Return the created collection
};

/**
 * Updates an existing collection by its ID and returns the updated collection.
 * @param collectionId - The ID of the collection to update.
 * @param update - A record of fields to update.
 * @returns The updated collection document.
 */
export const editCollection = async (
  collectionId: string,
  update: Record<string, any>
) => {
  const updatedCollection = await CollectionModel.findByIdAndUpdate(
    collectionId,
    { $set: update },
    { new: true } // Ensure the updated document is returned
  );
  return updatedCollection; // Return the updated collection
};

/**
 * Deletes a collection by its ID and returns the deleted collection document.
 * @param collectionId - The ID of the collection to delete.
 * @returns The deleted collection document.
 */
export const deleteCollection = async (collectionId: string) => {
  const deletedCollection = await CollectionModel.findByIdAndDelete(
    collectionId
  );
  return deletedCollection; // Return the deleted collection
};

// Admin Message Helpers

/**
 * Creates a new admin message and returns the created message document.
 * @param message - The message object to create.
 * @returns The created message document.
 */
export const createAdminMessage = async (message: AdminMessage) => {
  const newMessage = await AdminMessageModel.create(message);
  return newMessage; // Return the created message
};

/**
 * Updates an existing admin message by its ID and returns the updated message.
 * @param messageId - The ID of the message to update.
 * @param update - A record of fields to update.
 * @returns The updated message document.
 */
export const editAdminMessage = async (
  messageId: string,
  update: Record<string, any>
) => {
  const updatedMessage = await AdminMessageModel.findByIdAndUpdate(
    messageId,
    { $set: update },
    { new: true } // Ensure the updated document is returned
  );
  return updatedMessage; // Return the updated message
};

/**
 * Deletes an admin message by its ID and returns the deleted message document.
 * @param messageId - The ID of the message to delete.
 * @returns The deleted message document.
 */
export const deleteAdminMessage = async (messageId: string) => {
  const deletedMessage = await AdminMessageModel.findByIdAndDelete(messageId);
  return deletedMessage; // Return the deleted message
};

export const doesUserExist = async (user: string, key = "id") => {
  return Boolean(await UserModel.exists({ [key]: user }));
};

export const calculatePriceItems = async (
  items: IProduct[]
): Promise<number> => {
  // Utility function to get the applicable price of an item
  const getItemPrice = (item: IProduct) =>
    item?.hasDiscount ? item?.discountedPrice : item.price;

  const _store = await StorePromotionModel.findOne({ isActive: true });

  // Calculate the total price for all available items (applying individual discounts if available)
  let totalPrice = items.reduce((acc, item) => acc + getItemPrice(item), 0);

  // If there's no active store promotion, return the total price
  if (!_store) {
    return parseFloat(totalPrice.toFixed(2));
  }

  const store = _store as IPromotion;
  let discountedPrice = totalPrice; // Initialize discounted price as total price

  // Apply store-wide promotion logic
  if (store.applicableTo === "AllProducts") {
    // Apply the store-wide discount to all products
    discountedPrice = totalPrice * (1 - (store.discountPercentage || 0) / 100);
  } else if (store.applicableTo === "SelectedProducts" && store.productIds) {
    const selectedProductIds = store.productIds;

    let selectedItemsTotalPrice = 0;
    let nonSelectedItemsTotalPrice = 0;

    // Calculate total for selected and non-selected items
    items.forEach((item) => {
      const itemPrice = getItemPrice(item);

      if (
        item._id &&
        selectedProductIds.includes(item._id) &&
        !item.hasDiscount
      ) {
        selectedItemsTotalPrice += itemPrice; // Apply promotion only if no individual discount
      } else {
        nonSelectedItemsTotalPrice += itemPrice; // Regular price if not selected or already discounted
      }
    });

    // Apply discount to selected items
    const discountedSelectedItemsPrice =
      selectedItemsTotalPrice * (1 - (store.discountPercentage || 0) / 100);

    // Final price is sum of discounted selected items and non-selected items
    discountedPrice = discountedSelectedItemsPrice + nonSelectedItemsTotalPrice;
  }

  // Return the final price, rounded to 2 decimal places
  return parseFloat(discountedPrice.toFixed(2));
};

export const doesCollectionExist = async (collection: string) => {
  return Boolean(await CollectionModel.exists({ slug: collection }));
};

export const calculateDiscountPercentage = (
  price: number,
  discountedPrice: number
): number => {
  if (price <= 0 || discountedPrice < 0 || discountedPrice > price) {
    throw new Error("Invalid price or discounted price");
  }

  const discountPercentage = ((price - discountedPrice) / price) * 100;

  // Return the percentage rounded to the nearest whole number
  return Math.round(discountPercentage);
};

export const sendEmail = async (
  recipients: string,
  emailTemplate: string,
  replyTo?: string,
  subject?: string
) => {
  let configOptions: SMTPTransport | SMTPTransport.Options | string = {
    host: "smtp-relay.brevo.com",
    port: 587,
    ignoreTLS: true,
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.HOST_EMAIL_PASSWORD,
    },
  };

  const transporter = createTransport(configOptions);
  await transporter.sendMail({
    from: "noreply@gmail.com",
    to: recipients,
    html: emailTemplate,
    replyTo,
    subject: subject,
  });
};

export const formatCurrency = function (amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getAccessToken = (req: express.Request) => {
  return req.headers.authorization;
};

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

export const calculateDeliveryPrice = (state: string) => {
  const companyStation = { lat: 9.0802, lng: 6.0176 }; // Assuming company station is in Lagos
  //const pricePer85KM = 1700;

  if (!nigeriaStateData[state]) return null;

  const stateLocation = nigeriaStateData[state];

  //const distanceToState = calculateDistance(
  //  companyStation.lat,
  //  companyStation.lng,
  //  stateLocation.lat,
  //  stateLocation.lng
  //);

  //const distanceToLGA = calculateDistance(
  //  companyStation.lat,
  //  companyStation.lng,
  //  lgaLocation.lat,
  //  lgaLocation.lng
  //);

  //const totalDistance = distanceToState / 2;
  const price = nigeriaStateData[state];

  return price;
};

// Function to list all states
export function listStates() {
  return Object.keys(nigeriaStateData);
}

// Function to list all LGAs in a state
//export function listLGAs(state: string) {
//  if (!nigeriaStateData[state]) {
//    console.error(`State "${state}" not found in the database.`);
//    return null;
//  }
//  return Object.keys(nigeriaStateData[state]);
//}
