// User imports start here
const UserSchema = require("../models/UserSchema");

const jwt = require("jsonwebtoken");
const TOKEN_KEY = process.env.TOKEN_KEY;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication.");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
    const user = await UserSchema.findOne({ email: req.user.email });
    if (user.token === token) return next();
    else return res.status(401).send("Token is invalid.");
  } catch (err) {
    return res.status(401).send("Token is invalid.");
  }
};

module.exports = verifyToken;
