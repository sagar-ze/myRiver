const router = require("express").Router();
const bcrypt = require("bcrypt");
const _=require('lodash')

const { User, Validate } = require("../models/user");

router.post("/register", async (req, res, next) => {
  const { error } = Validate(req.body);
  if (error) return res.status(400).json({status:'failure',message:error.details[0].message});

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({status:'failure',message:"User already exist !"});

  user = new User(_.pick(req.body, ["username", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
});

module.exports = router;
