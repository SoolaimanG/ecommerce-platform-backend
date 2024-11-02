import {
  allowOnlyAdminsAndSuperUsers,
  allowOnlyAuthenticatedUsers,
  allowOnlySuperUser,
} from "./middleware";
import {
  _calculateDeliveryPrice,
  _calculatePriceItems,
  _createPromoBanner,
  _deleteProduct,
  _editOrder,
  addNewProduct,
  assignModerator,
  authenticateUser,
  cancelOrder,
  createCategory,
  createNewOrder,
  createOrEditBuySet,
  createOrEditStorePromotion,
  deleteMessage,
  deleteUser,
  editAddress,
  expenseInsight,
  getAdminMessage,
  getBestSellingProduct,
  getBuySet,
  getCollectionProducts,
  getCollections,
  getDashboardContent,
  getLatestDiscountedProduct,
  getNewsLetterSubscribers,
  getOrder,
  getOrderHistories,
  getProduct,
  getProducts,
  getProductSet,
  getPromoBanner,
  getRecentOrders,
  getSalesOverview,
  getStates,
  getStorePromotion,
  getTopSellers,
  getUser,
  getUsers,
  joinNewsLetter,
  removeSubscriber,
  sendEmailToSubscribers,
  sendMessageToUsers,
  sendOrderReminder,
  suggestedForYou,
  userClaimsToHaveMakePayment,
} from "./controller";
import express from "express";

const router = express.Router();

router.post("/authenticate-user/", authenticateUser);

// Public routes
router.get("/best-selling-product/", getBestSellingProduct);
router.get("/latest-discounted-product/", getLatestDiscountedProduct);
router.get("/collections/", getCollections);
router.get("/collections/:collection", getCollectionProducts);
router.get("/suggested-for-you/", suggestedForYou);
router.get("/top-sellers/", getTopSellers);
router.get("/product-set/", getProductSet);
router.get("/products/", getProducts);
router.get("/products/:productId/", getProduct);
router.post("/calculate-items-price/", _calculatePriceItems);
router.get("/calculate-delivery-price/", _calculateDeliveryPrice);
router.post("/join-newsletter/", joinNewsLetter);
router.post("/user-claim-to-have-make-payment/", userClaimsToHaveMakePayment);
router.get("/get-message/", getAdminMessage);
router.get("/get-promo-banner/", getPromoBanner);
router.patch("/cancel-order/:orderId", cancelOrder);
router.get("/get-store-sets/", getBuySet);
router.get("/get-states/", getStates);
router.get("/order/:orderId/", getOrder);

// Protected routes for users and admins
router.get("/user/", allowOnlyAuthenticatedUsers, getUser);
router.post("/edit-address/", allowOnlyAuthenticatedUsers, editAddress);
router.get("/recent-orders/", allowOnlyAuthenticatedUsers, getRecentOrders);
router.get("/order-histories/", allowOnlyAuthenticatedUsers, getOrderHistories);
router.get("/expense-insight/", allowOnlyAuthenticatedUsers, expenseInsight);

// Admin-only routes

router.post("/product/", allowOnlyAuthenticatedUsers, addNewProduct);
router.post(
  "/category/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  createCategory
);
router.get(
  "/users/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  getUsers
);
router.get(
  "/order-reminder/:orderId",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  sendOrderReminder
);
//router.post("/track-order/", trackOrder);
router.delete(
  "/product/:productId/",
  allowOnlyAuthenticatedUsers,
  _deleteProduct
);
router.delete(
  "/user/:userId/",
  allowOnlyAuthenticatedUsers,
  allowOnlySuperUser,
  deleteUser
);
router.get(
  "/dashboard-content/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  getDashboardContent
);
router.get(
  "/sales-overview/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  getSalesOverview
);
router.post(
  "/assign-moderator/:userId/",
  allowOnlyAuthenticatedUsers,
  allowOnlySuperUser,
  assignModerator
);
router.patch("/order/:orderId/", allowOnlyAuthenticatedUsers, _editOrder);
router.post(
  "/send-message/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  sendMessageToUsers
);
router.post("/order/", createNewOrder);
router.delete(
  "/message/:messageId/",
  allowOnlyAuthenticatedUsers,
  allowOnlySuperUser,
  deleteMessage
);
router.post(
  "/create-or-edit-store-banner/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  _createPromoBanner
);
router.post(
  "/create-or-edit-store-promotion/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  createOrEditStorePromotion
);
router.get(
  "/get-store-promotion/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  getStorePromotion
);
router.post(
  "/create-or-edit-store-set/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  createOrEditBuySet
);
router.get(
  "/news-letter-subscribers/",
  allowOnlyAuthenticatedUsers,
  allowOnlyAdminsAndSuperUsers,
  getNewsLetterSubscribers
);

router.post(
  "/send-email-to-subscribers/",
  allowOnlyAuthenticatedUsers,
  allowOnlySuperUser,
  sendEmailToSubscribers
);

router.delete(
  "/delete-subscribers/",
  allowOnlyAuthenticatedUsers,
  allowOnlySuperUser,
  removeSubscriber
);

//router.post("/verify-payment/", recievePayment);

export default (): express.Router => {
  return router;
};
