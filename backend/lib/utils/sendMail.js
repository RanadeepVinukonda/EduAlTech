import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // use TLS/SSL on port 465
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (to, subject, url) => {
  try {
    await transporter.sendMail({
      from: `"EduAltTech" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #10b981;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a href="${url}" style="display: inline-block; margin: 20px 0; padding: 12px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If you didn’t request this, just ignore this email.</p>
          <p>– The EduAltTech Team</p>
        </div>
      `,
    });

    console.log(`✅ Email sent to: ${to}`);
  } catch (err) {
    console.error("📧 Email sending failed:", err);
    throw err;
  }
};

export default sendMail;
