import mongoose from "mongoose";
import {
  AdminMessage,
  IBanner,
  IBuySet,
  ICollection,
  IOrder,
  IProduct,
  IPromotion,
  IUser,
} from "../types";

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    availableColors: { type: [String] },
    collection: { type: "String", required: true },
    description: { type: "String" },
    discountedPrice: { type: "Number", default: 0 },
    hasDiscount: { type: "Boolean", default: false },
    imgs: { type: [String] },
    isNew: { type: "Boolean", default: false },
    name: { type: "String", required: true },
    price: { type: "Number", required: true },
    rating: { type: "Number", default: 2 },
    stock: { type: "Number", required: true },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: "String", required: true },
    avatar: { type: "String", default: null },
    name: { type: "String", required: true },
    address: {
      state: { type: String },
      lga: { type: String },
    },
    recentOrder: {
      orders: { type: "Number" },
      products: [],
    },
    role: {
      type: "String",
      enum: ["user", "admin", "superuser"],
      default: "user",
    },
    totalSpent: { type: "Number" },
  },
  { timestamps: true }
);

const CollectionSchema = new mongoose.Schema<ICollection>(
  {
    image: { type: String, required: true }, // URL of the collection image
    name: { type: String, required: true }, // Name of the collection
    slug: { type: String, required: true, unique: true },
    remainingInStock: { type: Number, required: true },
  },
  { timestamps: true }
);

const AdminMessageSchema = new mongoose.Schema<AdminMessage>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true }, // Title of the message
    message: { type: String, required: true }, // The content of the message
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema<IOrder>(
  {
    customer: {
      name: { type: "String" },
      email: { type: "String", required: true },
      phoneNumber: { type: "String", required: true },
      note: { type: "String" },
    },
    items: [ProductSchema, { colorPrefrence: { type: String } }],
    deliveryFee: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    address: {
      state: { type: "String", required: true },
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentLink: { type: "String", required: true },
  },
  { timestamps: true }
);

const PromoBannerSchema = new mongoose.Schema<IBanner>(
  {
    message: { type: String, required: true },
    description: { type: String },
    productId: {
      type: "String",
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

const StorePromotionSchema = new mongoose.Schema<IPromotion>(
  {
    applicableTo: {
      type: "String",
      enum: ["SelectedProducts", "AllProducts"],
      default: "SelectedProducts",
    },
    discountPercentage: { type: "Number", required: true },
    endDate: { type: "Date", required: true },
    startDate: { type: "Date", required: true },
    isActive: { type: "Boolean", default: false },
    productIds: { type: [String] },
  },
  { timestamps: true }
);

const ProductSetSchema = new mongoose.Schema<IBuySet>({
  productIds: { type: [String], ref: "Product" },
  completeSetId: { type: String, ref: "Product", required: true },
});

const NewLetterSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("product", ProductSchema);
const UserModel = mongoose.model("user", UserSchema);
const OrderModel = mongoose.model("order", OrderSchema);
const CollectionModel = mongoose.model("collection", CollectionSchema);
const PromoModel = mongoose.model("promoBanner", PromoBannerSchema);
const ProductSetModel = mongoose.model("productSetModel", ProductSetSchema);
const StorePromotionModel = mongoose.model(
  "storePromotion",
  StorePromotionSchema
);
const AdminMessageModel = mongoose.model("adminMessage", AdminMessageSchema);
const NewLetterModel = mongoose.model("newsletter", NewLetterSchema);

export {
  ProductModel,
  UserModel,
  OrderModel,
  CollectionModel,
  PromoModel,
  StorePromotionModel,
  AdminMessageModel,
  ProductSetModel,
  NewLetterModel,
};
