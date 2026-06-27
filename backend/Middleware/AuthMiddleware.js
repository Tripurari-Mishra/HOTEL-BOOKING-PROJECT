import { User } from "../Models/User.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { wrapAsync } from "../utils/wrapAsync.js";

export const isLoggedIn = wrapAsync(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "User is not logged in! ⚠️" });
  }

  // Token ko verify
  const verifyUser = jwt.verify(token, process.env.JWT_SECRET);

  if (!verifyUser) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "User is not verified! Invalid token.",
    });
  }

  const foundUser = await User.findById(verifyUser.id).select("-password");
  if (!foundUser) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "User account does not exist anymore!",
    });
  }

  req.user = foundUser;
  next();
});

