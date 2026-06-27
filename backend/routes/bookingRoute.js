import { Router } from "express";
import { checkout, createBooking, getUserBookings, paymentVerification } from "../controllers/bookingController.js";
import { isLoggedIn } from "../Middleware/AuthMiddleware.js";

const router = Router();

router.post("/", isLoggedIn, createBooking);
router.get("/my-bookings", isLoggedIn, getUserBookings);

router.post("/checkout", isLoggedIn, checkout);
router.post("/verify", isLoggedIn, paymentVerification);

export const bookingRoute = router;
