const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const config=require('config')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 3,
    maxlength: 60,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique:true,
    required: true
  },
  password: {
    type: String,
    minlength: 8,
    maxlength: 100,
    required: true
  },
  isAdmin: {
      type:Boolean,
      default:false,
      required:true
  }
});
userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({
    _id: this._id,
    username: this.username,
    email: this.email,
    isAdmin: this.isAdmin
  },config.get("JWT_PRIVATE_KEY"));
  return token;
};

const User = mongoose.model("User", userSchema);
function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string()
      .min(3)
      .max(60)
      .required()
      .label("Username"),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "io", "org"] }
      })
      .min(5)
      .max(255)
      .required()
      .label("Email"),
    password: Joi.string()
      .min(8)
      .max(100)
      .required()
      .label("Password")
  });
  return schema.validate(user);
}

exports.Validate = validateUser;
exports.User = User;
