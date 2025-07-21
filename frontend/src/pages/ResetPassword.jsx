import React, { useState } from "react";
import api from "../axios"; // ✅ using shared axios instance
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/user/reset-password/${token}`, { password }); // ✅ token in URL
      toast.success("Password reset! Login with new password.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-full">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
