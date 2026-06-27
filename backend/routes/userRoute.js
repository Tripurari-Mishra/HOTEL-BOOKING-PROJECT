import { Router } from "express";
import {
  getLoggedInUser,
  isLogOut,
  userLogin,
  userRegister,
} from "../controllers/authController.js";

const router = Router();

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/logout", isLogOut);
router.get("/me", getLoggedInUser);

export const userRouter = router;
