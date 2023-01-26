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

    delete user.password;

    res.status(200).json({ user, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// update user / admin details
export const update = async (req, res) => {
  try {
    // update details
    const { firstName, middleName, lastName, email, department } = req.body;
    const userId = req.params.id;
    let setQuery = {};
    if (firstName) setQuery.firstName = firstName;
    if (middleName) setQuery.middleName = middleName;
    if (lastName) setQuery.lastName = lastName;
    if (email) setQuery.email = email;
    if (department) setQuery.department = department;

    // check if user exists

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    User.updateOne({ _id: userId }, { $set: setQuery }, (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ message: "User updated successfully" });
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

//   View users

export const view = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId, role: "user" }).select({
      firstName: 1,
      middleName: 1,
      lastName: 1,
      email: 1,
      department: 1,
    });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};

// admins viewing admins

export const viewAdmins = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("USER ID ", userId);
    const user = await User.findOne({ _id: userId, role: "admin" }).select({
      firstName: 1,
      middleName: 1,
      lastName: 1,
      email: 1,
      department: 1,
      role: 1,
    });

    if (!user) {
      return res.status(400).json({ error: "Admin not found!" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};
