import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "lax", // works for localhost and production
    secure: process.env.NODE_ENV === "production", // only https in prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
