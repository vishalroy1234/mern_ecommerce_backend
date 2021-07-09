const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");
const {
  isAuthenticated,
  isAuthorized,
  isAdmin,
} = require("../controllers/auth");
const {
  getCategoryById,
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

//params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//actual routes goes here
router.post(
  "/category/create/:userId",
  isAuthorized,
  isAuthenticated,
  isAdmin,
  createCategory
); //:userId because I want to validate the user if he is allowed to create a category
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);
router.put(
  "/category/:categoryId/:userId",
  isAuthorized,
  isAuthenticated,
  isAdmin,
  updateCategory
);
router.delete(
  "/category/:categoryId/:userId",
  isAuthorized,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
