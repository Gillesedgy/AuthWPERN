//5
const db = require("../db/dbConfig");

const getAllUsers = async () => {
  try {
    const allUsers = await db.any("SELECT * FROM users");
    return allUsers;
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    throw new Error("Failed to fetch users");
  }
};

const createUser = async (username, email, hashedPassword) => {
  try {
    const newUser = await db.one(
      "INSERT INTO users (username, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    return newUser;
  } catch (error) {
    console.error(`Error creating user: ${error}`);
    throw new Error("Failed to create user");
  }
};
// EMAIL
const findUserByEmail = async (email) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);
    return user;
  } catch (error) {
    console.error(`Error finding user: ${error}`);
    throw new Error("Failed to find user");
  }
};
// USERNAME
const findByUsername = async (username) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return user;
  } catch (error) {
    console.error(`Error finding user: ${error}`);
    throw new Error("Failed to find user");
  }
};
module.exports = { getAllUsers, createUser, findUserByEmail, findByUsername };
