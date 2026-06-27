import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { userRouter } from "./routes/userRoute.js";
import { listingRouter } from "./routes/listingRoute.js";
import { INTERNAL_SERVER_ERROR, StatusCodes } from "http-status-codes";
import { reviewRouter } from "./routes/reviewRoute.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import { bookingRoute } from "./routes/bookingRoute.js";

dotenv.config();
const app = express();

const sessionOptions = {
  secret: "MySecretIsSuperCode",
  saveUninitialized: false, // Production par false rakhna badhiya hai
  resave: false,
  cookie: {
    secure: true, // ✅ Production par HTTPS ke liye true zaroori hai
    httpOnly: true,
    sameSite: "none", // ✅ Cross-origin cookies ke liye sabse zaroori
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://hotel-booking-project-hazel.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
app.use(session(sessionOptions));
app.use(cookieParser());

const MONGO_URL = process.env.MONGO_URL;
const databaseConnected = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("database Connected");
  } catch (error) {
    console.log(error);
  }
};
databaseConnected();

app.use("/auth", userRouter);
app.use("/listings", listingRouter);
app.use("/listings", reviewRouter);
app.use("/api/bookings", bookingRoute);

app.get("/", (req, res) => {
  res.send("Start Project");
});

app.use((err, req, res, next) => {
  console.log("Central Error Log:", err);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  const message = err.message || "Something went wrong on the server!";

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("server is Listing PORT", PORT);
});