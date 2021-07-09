const express = require("express");
const router = express.Router();
const {
  getUserById,
  getUser,
  getAllUsers,
  updateUser,
  getUserPurchaseList,
  updatePassword,
} = require("../controllers/user");
const {
  isAuthorized,
  isAuthenticated,
  isAdmin,
} = require("../controllers/auth");

router.param("userId", getUserById); // miidleware which gets run whenever a request consisting of userId as parameter is encountered
router.get("/user/:userId", isAuthorized, isAuthenticated, getUser); //first of all above middleware runs
router.put("/user/:userId", isAuthorized, isAuthenticated, updateUser); //first of all above middleware runs
router.put(
  "/user/password/:userId",
  isAuthorized,
  isAuthenticated,
  updatePassword
);
router.get(
  "/orders/user/:userId",
  isAuthorized,
  isAuthenticated,
  getUserPurchaseList
);

// router.get('/users', getAllUsers)

module.exports = router;
