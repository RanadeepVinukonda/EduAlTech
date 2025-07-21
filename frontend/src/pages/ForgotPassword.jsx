import React, { useState } from "react";
import api from "../axios"; // ✅ use your custom axios instance
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/user/forgot-password", { email }); // ✅ relative URL
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="btn btn-success w-full">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
