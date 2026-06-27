import bcrypt from "bcrypt";
import { User } from "../Schema/User.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { wrapAsync } from "../utils/wrapAsync.js";

export const userRegister = wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;

  // 1. Validation:
  if (!username || !email || !password) {
    console.log("Validation Failed: Empty Fields");
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "All fields (username, email, password) are required!",
    });
  }

  const userExist = await User.findOne({ $or: [{ email }, { username }] });
  if (userExist) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Username or Email already exists!" });
  }

  // 2. Password Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 3. Create New User
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  console.log("New User Created:", newUser.username);

  let token = jwt.sign(
    {
      id: newUser._id,
      isAdmin: newUser.isAdmin,
    },

    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;

  // 4. Success Response
  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "User Registered and Login Successfully! 🎉",
    user: userWithoutPassword,
  });
});

export const userLogin = wrapAsync(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    console.log("Username and Password Empty");
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "username or Password is Empty" });
  }

  const userExist = await User.findOne({ username });

  if (!userExist) {
    console.log("UNAUTHORIZED User");
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "UNAUTHORIZED People Please First Register" });
  }

  const isMatch = await bcrypt.compare(password, userExist.password);
  if (isMatch) {
    const token = jwt.sign(
      {
        id: userExist._id,
        isAdmin: userExist.isAdmin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    console.log("login success");

    // 🍪 Token Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    req.session.user = {
      _id: userExist._id,
      username: userExist.username,
      email: userExist.email,
      isAdmin: userExist.isAdmin,
    };

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Login SuccessFull",
      token,
      user: {
        _id: userExist._id,
        username: userExist.username,
        email: userExist.email,
        isAdmin: userExist.isAdmin,
      },
    });
  } else {
    console.log("Password Wrong");
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Password Wrong" });
  }
});

export const isLogOut = wrapAsync(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
  });

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "User Logout successfully" });
});

export const getLoggedInUser = wrapAsync(async (req, res) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "No token found, please login" });
  }

  try {
    // 2. Token ko verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Database se user ka fresh data uthao
    const user = await User.findById(decoded.id).select("-password"); // Password chhor kar sab le aao

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "User not found" });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      user: user,
    });
  } catch (error) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Invalid or expired token" });
  }
});
