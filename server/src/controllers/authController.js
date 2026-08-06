const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/userModel");
const { success, error } = require("../utils/apiResponse");


const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      return error(res, "User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    };

    users.push(user);

    return success(
      res,
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      "User registered successfully",
      201
    );

  } catch (err) {
    return error(res, err.message);
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(
      (user) => user.email === email
    );

    if (!user) {
      return error(res, "Invalid email or password", 401);
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return error(res, "Invalid email or password", 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "secretkey",
      {
        expiresIn: "7d",
      }
    );

    return success(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      "Login successful"
    );

  } catch (err) {
    return error(res, err.message);
  }
};


module.exports = {
  register,
  login,
};