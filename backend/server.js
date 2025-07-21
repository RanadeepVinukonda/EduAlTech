
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

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
const __dirname = path.resolve(); // Get the current directory name
app.use(express.json({ limit: "50mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
const allowedOrigins = [
  "http://localhost:5173",
  "https://edu-al-tech.vercel.app",
  "https://edu-al-tech.vercel.app/",
  "https://www.edualtech.xyz",
  "https://edualtech.xyz",
  "https://edualtech.onrender.com", 
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/courses", lectureRoutes);
app.use("/api/admin", adminRoutes);


app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)


app.use(cookieParser());


if(process.env.NODE_ENV !== "production") {
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
}


app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});
