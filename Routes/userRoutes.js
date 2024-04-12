//6
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const authorization = require("../middleware/authorization");
require("dotenv").config();
//* Middleware
const validateUser = require("../middleware/validateUser"); //TODO:MUST VALIDATE INFOR
//* jwt generator
const {
  getAllUsers,
  getSingleUser,
  createUser,
  findUserByEmail,
  findByUsername,
} = require("../queries/users");
//
const users = require("express").Router();

//* Register User => SIGN UP USER
users.post("/register", validateUser, async (req, res) => {
  try {
    //1 req body destructuring
    const { username, email, password } = req.body;
    // 2check for user (exists or not => username or email)
    const userByUsername = await findByUsername(username);
    const userByEmail = await findUserByEmail(email);

    if (userByUsername) {
      return res
        .status(409)
        .json({ message: `Sorry, ${userByUsername.username} already taken` });
    }
    if (userByEmail) {
      return res
        .status(409)
        .json({ message: `Sorry, ${userByEmail.email} already taken` });
    }
    //3 bcrypt hash user info
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    //4 enter new user => CREATE USER HERE
    const newUser = await createUser(username, email, hashedPassword);

    //5 Generate token =>
    const token = jwtGenerator(newUser.user_id);
  
    res.status(201).json({ newUser, token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// LOG IN ==> //TODO:MUST VALIDATE INFOR
users.post("/login", validateUser, async (req, res) => {
  try {
    //   const { email, password } = req.body;
    // const user = await findUserByEmail(email);
    const { username, password } = req.body;
    const user = await findByUsername(username); // log in with username

    if (!user) {
      return res.status(401).json({ message: `User not found` });
    }
    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      // checking if pass is the same
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwtGenerator(user.user_id);
    res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
//* Get all Users
users.get("/users", async (req, res) => {
  try {
    const users = await getAllUsers();
    if (users) {
      res.status(200).json(users);
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});

//* Get Registered User => Autheniticated  User
users.get("/verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    res.status(500).send("Server error");
  }
});
//* Get  dashboard or Profile
users.get("/dashboard", authorization, async (req, res) => {
  // const userID = req

  try {
    const user = await getSingleUser(req.user);

    if (!user) {
      res.status(404).json({ message: `User Not Found` });
    }
    //DESTRUCTURE USER INFOR FOR PROFILE
    const { username, email } = user;
    res.status(200).json({ username, email });
  } catch (error) {
    res.status(500).json("Server Error");
  }
});

module.exports = users;
