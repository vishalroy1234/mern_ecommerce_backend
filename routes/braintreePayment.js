const express = require("express");
const router = express.Router();
const { isAuthenticated, isAuthorized } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { processPayment, getToken } = require("../controllers/braintreepayment");

router.param("userId", getUserById);

router.get(
  "/payment/gettoken/:userId",
  isAuthorized,
  isAuthenticated,
  getToken
);

router.post(
  "/payment/braintree/:userId",
  isAuthorized,
  isAuthenticated,
  processPayment
);

module.exports = router;
