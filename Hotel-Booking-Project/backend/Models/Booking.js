import mongoose from "mongoose"; // 👈 Sirf mongoose import karo

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId, // 👈 Pure format use karo
      ref: "Listing",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // 👈 Pure format use karo
      ref: "User",
      required: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
