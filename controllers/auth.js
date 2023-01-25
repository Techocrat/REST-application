import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
