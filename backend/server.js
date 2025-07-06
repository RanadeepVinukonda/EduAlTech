
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import {v2 as cloudinary} from "cloudinary";
import cookieParser from "cookie-parser";



import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import lectureRoutes from "./routes/lectureRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";



import connectMongoDB from "./db/connectMongoDB.js";	
dotenv.config();
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});




const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json({ limit: "50mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
	app.use(
		cors({
			origin: "http://localhost:5173", // Your Vite frontend URL
			credentials: true, // Allow cookies to be sent with requests
		})
	);

app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)


app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", lectureRoutes);
app.use("/api/admin", adminRoutes);


app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
