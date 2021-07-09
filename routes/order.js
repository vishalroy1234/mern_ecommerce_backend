const express = require("express");
const router = express.Router();
const {
  isAuthenticated,
  isAuthorized,
  isAdmin,
} = require("../controllers/auth");
const {
  getUserById,
  pushOrderInUserPurchaseList,
} = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
  getAllOrdersOfAUser,
} = require("../controllers/order");

//params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

//actual routes
router.post(
  "/order/create/:userId",
  isAuthorized,
  isAuthenticated,
  pushOrderInUserPurchaseList,
  updateStock,
  createOrder
);
router.get(
  "/order/all/:userId",
  isAuthorized,
  isAuthenticated,
  isAdmin,
  getAllOrders
);
router.get(
  "/order/:userId",
  isAuthorized,
  isAuthenticated,
  getAllOrdersOfAUser
);

//status of order
router.get(
  "/order/status/:userId",
  isAuthorized,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isAuthorized,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
