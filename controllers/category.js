const Category = require("../models/category");

const getCategoryById = (req, res, next, id) => {
  Category.findById(id, (err, category) => {
    if (err || !category) {
      return res.status(400).json({ error: "Cannot find this category in db" });
    }

    req.category = category;
    next();
  });
};

const createCategory = (req, res) => {
  console.log("createCategory", typeof req.body);
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res
        .status(400)
        .json({ error: "Not able to save category in db." });
    }
    res.json({ category });
  });
};

const getCategory = (req, res) => {
  return res.json(req.category);
};

const getAllCategory = (req, res) => {
  Category.find({}, (err, categories) => {
    if (err || !categories) {
      return res.json(400).json({ error: "No categories found" });
    }
    res.json(categories);
  });
};

const updateCategory = (req, res) => {
  Category.findOneAndUpdate(
    { _id: req.category._id },
    { $set: req.body },
    { new: true },
    (err, category) => {
      if (err) {
        return res.status(400).json({ error: "Could not update category" });
      }
      res.json(category);
    }
  );
};

const deleteCategory = (req, res) => {
  Category.findOneAndDelete({ _id: req.category._id }, (err, category) => {
    if (err) {
      return res.status(400).json({ error: "Could not delete category" });
    }
    res.json(category);
  });
};

module.exports = {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
