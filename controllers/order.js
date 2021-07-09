const { ProductInCart, Order } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product_id", "name price") //products is an array of objects.Each object references to another model(here Product)
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({ error: "no order found in db" });
      }
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({ error: "Failed to save ur order in db" });
    }
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, orders) => {
      if (err) {
        return res.status(400).json({ error: "no orders found in db" });
      }
      res.json(orders);
    });
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err) {
        return res.status(400).json({ error: "cannot update order status" });
      }
      res.json(order);
    }
  );
};

exports.getOrderStatus = (req, res) => {
  // what are the statuses which we can provide
  res.json(Order.schema.path("status").enumValues);
};

exports.getAllOrdersOfAUser = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "role name email")
    .populate({
      path: "products.product_id",
      select: "name description price category",
      populate: {
        path: "category",
        select: "name",
      },
    })
    .sort("createdAt")
    .exec((err, orders) => {
      if (err) {
        return res.json({ error: "Errors in fetching orders" });
      } else {
        return res.json(orders);
      }
    });
};
