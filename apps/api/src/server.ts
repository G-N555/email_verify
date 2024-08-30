import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import axios from "axios";
import "dotenv/config";

const verifyEmailFormatRegex = new RegExp(
  /^(?:[a-zA-Z0-9_'^&+/=?`{|}~.-]+)@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/
);

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use((res) => {
  return res.data;
});

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .get("/verify/:email", async (req, res) => {
      console.log("req.params.email", req.params.email);
      if (!req.params.email) {
        return res.status(400).json({ message: "Email is required" });
      }

      if (!verifyEmailFormatRegex.test(req.params.email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const response = await axiosInstance.get(
        `${process.env.HUNTER_BASE_URL}/email-verifier?email=${req.params.email}&api_key=${process.env.HUNTER_API_KEY}`
      );

      console.log("response", response.data);

      return res.json({ ...response.data });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true });
    });

  return app;
};
