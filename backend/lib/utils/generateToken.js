import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (user, res) => {
  const token = jwt.sign(
    { userId: user._id, role: user.role }, // 🔑 include role
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
