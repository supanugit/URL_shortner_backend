import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/DB.js";
import { errorResponse, successResponse } from "./utils/responseHelper.js";
import { Url } from "./shema/url.js";
import { nanoid } from "nanoid";
import cors from "cors";
import morgan from "morgan";
const app = express();
dotenv.config();
app.use(cors({ origin: "*" }), morgan("dev"));
await connectDB();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      errorResponse(res, "please sent the url !");
    }
    const uniqueID = nanoid(6);
    const have = await Url.findOne({ originalurl: url });
    if (have) {
      return successResponse(
        res,
        `${process.env.url}:${process.env.PORT}/${have.uniqueID}`,
        "You already got the shortURL"
      );
    }
    const creatUrl = await Url.create({
      uniqueID,
      originalurl: url,
      clicks: 0,
    });
    if (!creatUrl) {
      return errorResponse(res, "Somthing went wrong !");
    }
    return successResponse(
      res,
      `${process.env.url}:${process.env.PORT}/${uniqueID}`
    );
  } catch (error) {
    return errorResponse(res, error.message || "Server error");
  }
});
app.get("/:unique", async (req, res) => {
  try {
    const { unique } = req.params;
    if (!unique) {
      return errorResponse(res, "Unique path not found !");
    }
    const originalURL = await Url.findOne({ uniqueID: unique });
    if (!originalURL) {
      return errorResponse(res, "Invalid URL !");
    }
    const url = originalURL.originalurl;
    originalURL.clicks += 1;
    await originalURL.save();
    res.redirect(url);
  } catch (error) {
    return errorResponse(res, error.message || "Server error");
  }
});

app.listen(process.env.PORT, () => {
  console.log(
    `The server is running at ${process.env.url}:${process.env.PORT}`
  );
});
