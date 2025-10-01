import mongoose from "mongoose";

const urlShema = new mongoose.Schema(
  {
    originalurl: {
      type: String,
      required: true,
      uniqe: true,
    },
    uniqueID: {
      type: String,
      required: true,
      uniqe: true,
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Url = mongoose.model("url", urlShema);
