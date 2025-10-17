// src/components/Contact.jsx
import { useState } from "react";
import api from "../axios";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await api.post("/user/submit", formData);
      setStatus(res.data.message);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      if (err.response && err.response.data?.error) {
        setStatus(err.response.data.error);
      } else {
        setStatus("Server error. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Contact Us
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input input-bordered input-primary w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input input-bordered input-primary w-full"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
            className="input input-bordered input-primary w-full"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="textarea textarea-primary w-full"
          ></textarea>
          <button type="submit" className="btn btn-primary w-full mt-2">
            Send Message
          </button>
        </form>
        {status && (
          <p className="mt-4 text-center text-success font-medium">{status}</p>
        )}
      </div>
    </div>
  );
}
