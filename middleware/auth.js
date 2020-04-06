const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({status:"failure",message:"Access denied. No token provided."});

  try {
    const decoded = jwt.verify(token,config.get(" JWT_PRIVATE_KEY"));
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({status:"failure",message:"Invalid token."});
  }
};