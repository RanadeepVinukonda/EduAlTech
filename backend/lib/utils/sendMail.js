import nodemailer from "nodemailer";

const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_EMAIL,
      pass: process.env.BREVO_PASS,
    },
  });

  await transporter.sendMail({
    from: `"EduAltTech" <${process.env.BREVO_EMAIL}>`,
    to,
    subject,
    text,
  });
};
export default sendMail;
