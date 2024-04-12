//7
const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtGenerator = (userId) => {
  const payload = {
    user_id: userId,  // This is the user's ID from the database
  };
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
};

module.exports = jwtGenerator;
