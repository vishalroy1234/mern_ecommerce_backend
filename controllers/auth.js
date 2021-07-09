const User = require("../models/user");
const { validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt"); // works same as jwt.verify()

const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().reduce((initial, current) => {
        return `${initial} ${current.msg}`;
      }, ""),
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ error: "User not saved to database." });
    }
    return res.status(201).json(user);
  });
};

const signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array().reduce((initial, current) => {
        return `${initial} ${current.msg}`;
      }, ""),
    });
  }

  User.findOne({ email }, (err, user) => {
    console.log(user);
    if (err || !user) {
      console.log("user not found");
      return res
        .status(400)
        .json({ error: "USER does not exist in our database." });
    }

    if (!user.authenticate(password)) {
      return res
        .status(401)
        .json({ error: "Email and password does not match." });
    }

    //create token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    //put token in cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    });

    //respond to frontend
    console.log("TOKEN", token);
    const { _id, name, role, email } = user;
    return res.json({ token, user: { _id, name, role, email } });
  });
};

const signout = (req, res) => {
  res.clearCookie("token"); // clearCookie -> cookieParser middleware
  res.send("user signed out");
};

// const isAuthorized = (req,res,next)=>{
//     const token = req.headers.authorization.split(' ')[1]
//     console.log(token)
//     jwt.verify(token,process.env.SECRET,(err,user)=>{
//         if(err){
//             return res.send('error in authorization')
//         }
//         console.log('isAuthorized middleware ',user)
//         next()
//     })

// }
const isAuthorized = expressJwt({
  secret: process.env.SECRET,
  userProperty: "user", // attaches the payload value to req.user
});

// suppose I am authorized and want to grab another user account.I must not be able to.This middleware helps us to achieve this.
// u can only edit your profile and not other's
const isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.user && req.profile._id == req.user._id;
  if (!checker) {
    return res.status(403).json({ error: "access denied" });
  }
  next();
};

// middleware to check if loggedIn user is an admin or not??
const isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({ error: "u are not admin.....access denied" });
  }
  next();
};

module.exports = {
  signout,
  signup,
  signin,
  isAuthorized,
  isAuthenticated,
  isAdmin,
};
