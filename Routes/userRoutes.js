//6
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
// Middleware
const {
  loginSchema,
  registrationSchema,
} = require("../middleware/validateUser"); //TODO:MUST VALIDATE INFOR
// jwt generator
const jwtGenerator = require("../utils/jwtGenerator");
const {
  getAllUsers,
  createUser,
  findUserByEmail,
  findByUsername,
} = require("../queries/users");
const users = require("express").Router();

// Register User
users.post("/register", async (req, res) => {
  try {
    //1 req body destructuring
    const { username, email, password } = req.body;
    // const isUser = await getAllUsers();
    // 2check for user (exists or not => username or email)
    const userByUsername = await findByUsername(username);
    const userByEmail = await findUserByEmail(email);

    if (userByUsername) {
      return res.status(409).json({ message: "Username already taken" });
    }
    if (userByEmail) {
      return res.status(409).json({ message: "Email already taken" });
    }
    //3 bcrypt hash user info
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    //4 enter new user
    const newUser = await createUser(username, email, hashedPassword);

    //5 Generate token =>
    const token = jwtGenerator(newUser.id);
    // const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET_KEY, {
    //   expiresIn: "24h",
    // });
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// LOG IN ==> //TODO:MUST VALIDATE INFOR
users.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      // checking if pass is the same
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwtGenerator(user.id);

    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = users;
