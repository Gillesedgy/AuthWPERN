// 1
const express = require("express");
const app = express();
const cors = require("cors");
//  user Route
const userRoute = require("./Routes/userRoutes");
app.use(cors());
app.use(express.json()); // get data from the request body object

//
app.get("/", (req, res) => {
  res.send("WELCOME TO JWT PERN PRACTICE");
});

//
app.use("/user", userRoute);

// Register User

// Login User

//
app.listen(4445, () => {
  // app.send("hello")
  console.log("Currently listening on port 4445");
});
