const mongoose = require("mongoose");
const Category = require("./category");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
      maxlength: 32,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category, // from where are u pulling this ObjectId
      required: true,
    },
    stock: {
      type: Number,
    },
    sold: {
      type: Number,
      default: 0,
    },
    photo: {
      // this is how you store images in db
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
