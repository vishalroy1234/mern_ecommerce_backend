const mongoose = require("mongoose"); // default require
const { createHmac } = require("crypto"); // named require  // helps in encrypting
const { v1: uuidv1 } = require("uuid"); // named require // uuidv1 is alias for v1  // generates random strings

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 32,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    userinfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
); // The second parameter of mongoose.Schema adds 2 fields to every document:=> 1.createdAt 2.updatedAt

// defining virtual fields.They aren't saved into databases.
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password; // created a private field.  // 'this' points to a particular user
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

// defining methods on schema
userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.encry_password === this.securePassword(plainpassword);
  },
  securePassword: function (plainpassword) {
    if (!plainpassword) {
      return "";
    }

    try {
      return createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

const User = mongoose.model("user", userSchema);

module.exports = User;
