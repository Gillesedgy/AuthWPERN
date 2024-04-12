// 1
const express = require("express");
const app = express();
const cors = require("cors");
//  User Routes
const userRoute = require("./Routes/userRoutes");

// Middleware
app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // get data from the request body object
app.use(express.urlencoded({ extended: false }));

// User's Routes
app.use("/user", userRoute); //=>  Allow for /registration, /login and /verify

//
app.get("/", (req, res) => {
  res.send("WELCOME TO JWT PERN PRACTICE");
});

app.listen(4445, () => {
  // app.send("hello")
  console.log("Currently listening on port 4445");
});
