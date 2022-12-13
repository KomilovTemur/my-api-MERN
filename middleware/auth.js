const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
  const token = req.cookies.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRETKEY);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;
