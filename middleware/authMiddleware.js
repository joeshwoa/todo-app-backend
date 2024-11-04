const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization").split(' ')[1];
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
