//9
//TODO: Validate user infor
module.exports = function (req, res, next) {
  const { email, username, password } = req.body;

  function validEmail(userEmail) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
  }

  if (req.path === "/signup") {
    if (![email, username, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    } else if (!validEmail(email)) {
      return res.json("Invalid Email");
    }
  } else if (req.path === "/login") {
    if (![username, password].every(Boolean)) {
      return res.status(401).json("Missing Credentials");
    }
  }

  next();
};
// const Joi = require("joi");

// const loginSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
// });

// const registrationSchema = Joi.object({
//   username: Joi.string().alphanum().min(3).max(30).required(),
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
// });

// module.exports = { loginSchema, registrationSchema };
