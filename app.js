import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet"; //-----> Helmet is Express middleware. Helmet helps you secure your Express apps by setting various HTTP headers
import morgan from "morgan";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import { Server } from "socket.io";
import UserLog from "./models/UserLog.js";



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

// registering and login
app.use("/api/v1/auth", authRoutes);

// all user related routes
app.use("/api/v1/user", userRoutes);

// all admin related routes
app.use("/api/v1/admin", adminRoutes);



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
