import dotenv from "dotenv";
dotenv.config();
//temp test check
console.log("WORKOS_CLIENT_ID loaded:", !!process.env.WORKOS_CLIENT_ID);
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

const app = express();

//communicate with the backend using auth
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`) //only startup log

});