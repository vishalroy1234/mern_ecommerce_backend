const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category_id")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({ error: "product not found..." });
      }
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Problem with image" });
    }

    //restrictions on fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({ error: "Please include all fields" });
    }

    let product = new Product(fields);

    //handleing of files
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({ error: "File size too big" });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    } else {
      return res.status(400).json({ error: "Please insert a photo" });
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "saving tshirt in db failed",
        });
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  // whenever there is some bulky data(like images,mp3) which is passed by the db. It becomes extremely slow.
  //so we create a middleware which will handle the responding of these bulky data
  return res.json(req.product);
};

// middleware that will make our application very fast.Code optimization
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    // safe chaining ie if data present in db then only execute
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({ error: "failed to delete the product" });
    }
    res.json({
      message: "deleted successfully",
      deletedProduct,
    });
  });
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ error: "Problem with image" });
    }

    //updation code
    let product = req.product;
    product = _.extend(product, fields);
    // product = {...product, fields}

    //handling of files
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({ error: "File size too big" });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Updation of product failed ",
        });
      }
      res.json(product);
    });
  });
};

//product listing
exports.getAllProducts = (req, res) => {
  let limit = parseInt(req.query.limit) || 8;
  let sortBy = req.query.sortBy || "_id";
  Product.find()
    .select("-photo")
    .populate("category_id")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ error: "no product found" });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category_id", {}, (err, category) => {
    if (err) {
      return res.status(400).json({ error: "no category found" });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product.product_id },
        update: { $inc: { stock: -product.count, sold: +product.count } },
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({ error: "bulk write failed" });
    }
    next();
  });
};
