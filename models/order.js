const mongoose = require("mongoose");
const Product = require("./product");
const User = require("./user");

const ProductInCartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
  },
  name: String,
  price: Number,
  count: Number,
});

const orderSchema = new mongoose.Schema(
  {
    products: [ProductInCartSchema],
    transaction_id: {},
    amount: {
      type: Number,
    },
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"], //only these values are acceptable in status field
    },
    updated: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
const ProductInCart = mongoose.model("productincart", ProductInCartSchema);

module.exports = { Order, ProductInCart };
