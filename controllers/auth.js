import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { io } from "socket.io-client";

const socket = io("ws://localhost:4000");

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    // check if all mandatory fields are present
    const { firstName, lastName, email, password, confirmPassword, role } =
      req.body;

      
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return res
        .status(400)
        .json({ error: "All mandatory fields are required" });
    }

    //check if email already exists
    



    // check if password meets the required length
    if (password.length < 6 || password.length > 12) {
      return res
        .status(400)
        .json({ error: "Password should have 6 to 12 characters" });
    }

    // check if confirm password matches password
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and confirm password do not match" });
    }

    // check if user is an admin
    if (role === "admin" || role === "user") {
      // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create the user
      const user = new User({
        firstName,
        middleName: req.body.middleName || "",
        lastName,
        email,
        password: hashedPassword,
        role,
        department: req.body.department || "",
      });

      // save the user to the database
      await user.save();

      return res.json({ message: "User added successfully" });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if all mandatory fields are present
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "All mandatory fields are required" });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(email, password);

    socket.emit("login", { email });
    delete user.password;

    res.status(200).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
