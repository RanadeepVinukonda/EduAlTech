// utils/sendMail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // typically false for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendMail = async (to, subject, resetLink) => {
  const htmlContent = `
    <h2>EduAltTech - Password Reset</h2>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetLink}" target="_blank" style="color: green;">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  const mailOptions = {
    from: `"EduAltTech Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};
export default sendMail;
