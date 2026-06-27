import mongoose, { mongo } from "mongoose";
import { Schema, model } from "mongoose";

const roomSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    maxPeople: {
      type: Number,
      min: 1,
      max: 10,
    },
    description: {
      type: String,
      required: true,
    },
    roomNumbers: [
      {
        number: { type: Number, required: true },
        unavailableDates: { type: [Date] },
      },
    ],
  },
  { timestamps: true },
);

export const Room = model("Room", roomSchema);
