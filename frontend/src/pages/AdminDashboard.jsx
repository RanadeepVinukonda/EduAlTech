import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import api from "../axios"; // Adjust the path as necessary
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [lectures, setLectures] = useState([]);

  // Fetch users and lectures on mount
  useEffect(() => {
    fetchUsers();
    fetchLectures();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const fetchLectures = async () => {
    try {
      const res = await api.get("/courses/all", { withCredentials: true });
      setLectures(res.data);
    } catch (err) {
      toast.error("Failed to load lectures");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/user/${id}`, { withCredentials: true });
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const deleteLecture = async (id) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await api.delete(`/admin/lecture/${id}`, { withCredentials: true });
      toast.success("Lecture deleted");
      fetchLectures();
    } catch (err) {
      toast.error("Failed to delete lecture");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome, <span className="font-semibold">{user?.fullName}</span>.
          Manage the platform below.
        </p>

        {/* Tabs */}
        <div className="tabs tabs-boxed bg-white mb-6">
          <button
            onClick={() => setTab("users")}
            className={`tab ${tab === "users" && "tab-active text-green-600"}`}
          >
            Users
          </button>
          <button
            onClick={() => setTab("lectures")}
            className={`tab ${
              tab === "lectures" && "tab-active text-green-600"
            }`}
          >
            Lectures
          </button>
          <button
            onClick={() => setTab("analytics")}
            className={`tab ${
              tab === "analytics" && "tab-active text-green-600"
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Users Tab */}
        {tab === "users" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {users.map((u) => (
              <div
                key={u._id}
                className="card bg-white shadow border border-green-100"
              >
                <div className="card-body">
                  <h2 className="card-title text-green-700">
                    {u.fullName || u.username}
                  </h2>
                  <p>Role: {u.role}</p>
                  <p>Email: {u.email}</p>
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => deleteUser(u._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lectures Tab */}
        {tab === "lectures" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lectures.map((lec) => (
              <div
                key={lec._id}
                className="card bg-white shadow border border-green-100"
              >
                <div className="card-body">
                  <h2 className="card-title text-green-700">{lec.title}</h2>
                  <p>Subject: {lec.subject}</p>
                  <p>Uploaded By: {lec.uploadedBy?.fullName || "Unknown"}</p>
                  <div className="card-actions justify-end">
                    <button
                      onClick={() => deleteLecture(lec._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {tab === "analytics" && (
          <div className="bg-white p-6 rounded shadow text-gray-700 border border-green-100">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Platform Analytics
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Total users: {users.length}</li>
              <li>Total lectures: {lectures.length}</li>
              <li>
                Active providers:{" "}
                {users.filter((u) => u.role === "provider").length}
              </li>
              <li>Most recent lecture: {lectures[0]?.title || "N/A"}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
