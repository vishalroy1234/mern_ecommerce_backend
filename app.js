const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const bodyParser = require('body-parser')

//DB Connection
mongoose.connect(
  process.env.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (!err) {
      console.log("DB CONNECTED");
    } else {
      console.log("ERROR: " + err);
    }
  }
);

const app = express();

//Middlewares
app.use(cookieParser());
app.use(express.json()); // parsing post request body whose content-type is application/json
app.use(express.urlencoded({ extended: true })); // parsing post request body whose content-type is application/x-www-form-urlencoded
app.use(cors());

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripePayment");
const braintreeRoutes = require("./routes/braintreePayment");

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", braintreeRoutes);

//PORT
const port = process.env.PORT || 7000;

//Starting a server
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
