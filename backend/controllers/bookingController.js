import { Booking } from "../Schema/Booking.js";
import { Listing } from "../Schema/Listing.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { StatusCodes } from "http-status-codes";
import Razorpay from "razorpay";
import crypto from "crypto";

// Razorpay Instance Initialize karo
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. CHECKOUT CONTROLLER (Order Create Karne Ke Liye)
export const checkout = wrapAsync(async (req, res) => {
  let { amount } = req.body;

  const option = {
    amount: Number(amount * 100),
    currency: "INR",
    receipt: `receipt_order_${Date.now()}`,
  };

  const order = await razorpay.orders.create(option);

  if (!order) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Order is not created Razorpay issue" });
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Order is Created",
    order: order,
  });
});

// 2. PAYMENT VERIFICATION CONTROLLER (Payment Status Confirm karne ke liye)
export const paymentVerification = wrapAsync(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData, // 👈 Frontend se bheja hua booking payload
  } = req.body;

  // 1. Signature Verification (Ekdam mast chal raha hai tera)
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // 2. bookingData ke andar se saari required fields nikalo
    const { listing, checkIn, checkOut, totalPrice } = bookingData;

    // 3. New Booking Document banao saari fields ke saath
    const newBooking = new Booking({
      user: req.user._id,
      listing: listing, // 👈 Ye zaroori fields ab schema ko milengi
      checkIn: checkIn, // 👈
      checkOut: checkOut, // 👈
      totalPrice: totalPrice, // 👈
      status: "Confirmed",
      paymentId: razorpay_payment_id, // Optional: tracking ke liye save kar lo
      orderId: razorpay_order_id, // Optional
    });

    // 4. Database me save karo
    await newBooking.save();

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Payment Verified & Booking Confirmed Successfully!",
      bookingId: newBooking._id,
    });
  } else {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Payment verification failed! Ghoochala detected.",
    });
  }
});

export const createBooking = wrapAsync(async (req, res) => {
  let { listingId, checkIn, checkOut, totalPrice } = req.body;

  const listing = await Listing.findById(listingId);

  if (!listing) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Listing is Not Found" });
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkOutDate <= checkInDate) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Check-out date hamesha Check-in date ke baad honi chahiye!",
    });
  }

  const bookingObj = {
    listing: listingId,
    user: req.user._id,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
    status: "Pending",
  };

  const newBooking = await Booking.create(bookingObj);

  if (!newBooking) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal issue" });
  }

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "New Booking is Created Successfully",
    booking: newBooking,
  });
});

export const getUserBookings = wrapAsync(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "User is not authorized or logged in" });
  }

  // 2. Fetch Bookings
  const bookings = await Booking.find({ user: userId })
    .populate({
      path: "listing",
      select: "title description image price location country",
    })
    .sort({ createdAt: -1 });

  if (bookings.length === 0) {
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Bhai, abhi tak koi booking nahi ki hai tumne!",
      data: [],
    });
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "User Bookings returned successfully",
    data: bookings,
  });
});
