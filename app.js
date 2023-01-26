import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"; //-----> Helmet is Express middleware. Helmet helps you secure your Express apps by setting various HTTP headers
import morgan from "morgan";
import { Server } from "socket.io";
import UserLog from "./models/UserLog.js";

import {
  register,
  login,
  update,
  updateAdmin,
  view,
  viewAdmins,
} from "./controllers/auth.js";
import { verifyToken, verifyAdminApiAuthHandler } from "./middleware/auth.js";

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
const io = new Server(4000);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  console.log(socket.handshake.query.uid);

  socket.on("login", async (data) => {
    console.log(data);
    const userLog = await UserLog.create({
      username: data.email,
      userId: data.uid,
    });

    console.log(userLog);
  });
});

/* ROUTES */

// registering users and admins
app.post("/api/v1/auth/register", register);

// login users and admins
app.post("/api/v1/login", login);

// updating other users and himself
app.put("/api/v1/user/update/:id", verifyToken, update);

// updating other admins and himself
app.put(
  "/api/v1/admin/update/:id",
  verifyToken,
  verifyAdminApiAuthHandler,
  updateAdmin
);

// user viewing all users
app.get("/api/v1/user/:id", verifyToken, view);

// admin viewing all users
app.get(
  "/api/v1/admin/:id",
  verifyToken,
  verifyAdminApiAuthHandler,
  viewAdmins
);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`DB connected... Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
