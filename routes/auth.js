const express = require("express");
const router = express.Router();
const {
  signout,
  signup,
  signin,
  isAuthorized,
} = require("../controllers/auth.js");
const { check } = require("express-validator");

router.get("/signout", signout);
router.post(
  "/signup",
  check("email").isEmail().withMessage("Enter a valid email."),
  check("password")
    .isLength({ min: 5 })
    .withMessage("Password must be of atleast 5 characters length."),
  signup
);
router.post(
  "/signin",
  check("email").isEmail().withMessage("Enter a valid email."),
  check("password")
    .isLength({ min: 1 })
    .withMessage("Password field must not be left empty."),
  signin
);

router.get("/test", isAuthorized, (req, res) => {
  res.send(req.user);
});

module.exports = router;
