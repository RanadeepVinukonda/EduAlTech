import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ true on Render
    sameSite: "none", // ✅ needed for cross-domain (frontend <-> backend)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
