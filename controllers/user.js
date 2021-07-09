const User = require("../models/user");
const Order = require("../models/order");
const Product = require("../models/product");

//middleware -> router.param
const getUserById = (req, res, next, id) => {
  //id is the parameter value -> userId
  User.findOne({ _id: id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "no user was found in db" });
    }

    req.profile = user;
    // removing some unnecessary properties from req.profile
    req.profile.encry_password = undefined;
    req.profile.salt = undefined;
    next();
  });
};

const getUser = (req, res) => {
  return res.json(req.profile);
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.profile._id,
    { $set: req.body },
    { useFindAndModify: false, new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({ error: "Not authorized to update" });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      return res.json(user);
    }
  );
};

const updatePassword = (req, res) => {
  const user = req.profile;
  user.password = req.body.password;
  user.save((err, user) => {
    if (err) {
      res.status(400).json({ error: "Could not update password" });
    } else {
      user.encry_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  });
};

const getUserPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({ error: "no order in this account" });
      }
      return res.json(order);
    });
};

//helper function of pushOrderInUserPurchaseList
const fillPurchasesList = (req) => {
  return new Promise((resolve, reject) => {
    let purchases = [];
    let itemsVisited = 0;
    req.body.order.products.forEach((product, index, array) => {
      Product.findOne({ _id: product.product_id })
        .populate("category")
        .exec((err, prod) => {
          itemsVisited += 1;
          purchases.push({
            _id: prod._id,
            name: prod.name,
            description: prod.description,
            category: prod.category?.name ?? prod.category,
            quantity: product.count,
            amount: product.price * product.count,
            orderedOn: new Date().toDateString(),
            transaction_id: req.body.order.transaction_id,
          });
          if (itemsVisited === array.length) {
            resolve(purchases);
          }
        });
    });
  });
};

const pushOrderInUserPurchaseList = async (req, res, next) => {
  try {
    let purchases = await fillPurchasesList(req);
    User.findOneAndUpdate(
      { _id: req.profile._id },
      { $push: { purchases: purchases } },
      { new: true },
      (err, user) => {
        console.log("updated USER", user);
        if (err) {
          return res.status(400).json({
            error: "unable to save purchase list",
          });
        }
        next();
      }
    );
  } catch (error) {
    console.log(error);
  }
};

// const pushOrderInUserPurchaseList = (req, res, next) => {
//   let purchases = [];
//   var itemsProcessed = 0; // very important
//   //https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
//   req.body.order.products.forEach((product, index, array) => {
//     Product.findOne({ _id: product.product_id })
//       .populate("category")
//       .exec((err, prod) => {
//         itemsProcessed++;
//         console.log("PRODUCT", prod); //getting a product
//         purchases.push({
//           _id: prod._id,
//           name: prod.name,
//           description: prod.description,
//           category: prod.category?.name ?? prod.category,
//           quantity: product.count,
//           amount: product.price * product.count,
//           transaction_id: req.body.order.transaction_id,
//         });
//         if (itemsProcessed === array.length) {
//           // we want to run this code only after forEach loop is completed
//           console.log("PURCHASES...", purchases); // purchases is empty here??why??why isn't is updated??
//           User.findOneAndUpdate(
//             { _id: req.profile._id },
//             { $push: { purchases: purchases } },
//             { new: true },
//             (err, purchases) => {
//               console.log("PURCHASES", purchases);
//               if (err) {
//                 return res.status(400).json({
//                   error: "unable to save purchase list",
//                 });
//               }
//               next();
//             }
//           );
//         }
//       });
//   });
// };

// const getAllUsers = (req,res)=>{
//     User.find({},(err, users)=>{
//         if(err || users.length === 0){
//             return res.status(400).json({error:'no users in db'})
//         }

//         res.status(200).json(users)
//     })
// }

module.exports = {
  getUserById,
  getUser,
  updateUser,
  getUserPurchaseList,
  pushOrderInUserPurchaseList,
  updatePassword,
};
