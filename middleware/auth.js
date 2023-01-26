import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).send("Invalid access token");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.id);

    if (!user) {
      return res.status(401).send("Invalid access token");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyAdminApiAuthHandler = async (req, res, next) => {
    try {
        if(req.user.role === "admin"){
            next();
        } else {
            return res.status(403).send("Access Denied");
        }
    } catch (err) { 
        res.status(500).json({ error: err.message });
    }
};

