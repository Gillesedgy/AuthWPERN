//8 => checking for valid token 
require("dotenv").config();
const jwt = require("jsonwebtoken");
module.exports = async (req, res, next) => {
  try {
    const jwtToken = req.header("token"); // client side => token from fetch request

    if (!jwtToken) {
      return res.status(403).json({ message: "Not Authorized" });
    }
    // verify the token payload
    const payload = jwt.verify(jwtToken ,process.env.JWT_SECRET_KEY);
    req.user = payload.user; // user from generator
  } catch (error) {
    console.error(error.message);
    return res.status(403).json({ message: "Not Authorized" });
  }
};
