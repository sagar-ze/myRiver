const router = require("express").Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");

const { User } = require("../models/user");

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid username or password !" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res
      .status(400)
      .json({ status: "fail", message: "Invalid username or password !" });

  const token = user.generateAuthToken();
  res.status(200).json({status:"success",token:token});
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net", "io", "org"] },
      })
      .min(5)
      .max(255)
      .required()
      .label("Email"),
    password: Joi.string().min(8).max(100).required().label("Password"),
  });
  return schema.validate(user);
}
module.exports = router;
