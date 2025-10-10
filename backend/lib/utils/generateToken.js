import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true for production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // fix CORS issues in local dev
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Token generation failed");
  }
};
