// src/components/Contact.jsx
import { useState } from "react";
import api from "../axios"; // import your Axios instance

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
    <div className="max-w-lg mx-auto p-6 bg-base-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Contact Us</h2>
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
        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
      {status && <p className="mt-4 text-success">{status}</p>}
    </div>
  );
}
