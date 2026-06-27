import mongoose, { Schema } from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// ✅ SAFE EXPORT: Yeh check karega ki model pehle se compile toh nahi hai
export const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
