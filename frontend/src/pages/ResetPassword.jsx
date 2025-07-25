import React, { useState } from "react";
import api from "../axios";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/user/reset-password/${token}`, { password });
      toast.success("Password reset! Login with new password.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.msg || "Reset failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">
            Reset Password
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">New Password</span>
              </div>
              <input
                type="password"
                placeholder="Enter your new password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            <button type="submit" className="btn btn-success w-full">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
