import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import api from "../axios";
import { toast } from "react-hot-toast";
import Loader from "../components/Loader";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState("users");
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [userRes, lectureRes] = await Promise.all([
          api.get("/admin/users", { withCredentials: true }),
          api.get("/courses/all", { withCredentials: true }),
        ]);
        setUsers(userRes.data);
        setLectures(lectureRes.data);
      } catch (err) {
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/user/${id}`, { withCredentials: true });
      toast.success("User deleted");
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const deleteLecture = async (id) => {
    if (!window.confirm("Delete this lecture?")) return;
    try {
      await api.delete(`/admin/lecture/${id}`, { withCredentials: true });
      toast.success("Lecture deleted");
      setLectures((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      toast.error("Failed to delete lecture");
    }
  };

  if (loading) return <Loader message="Loading Admin Dashboard..." />;

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Welcome, <span className="font-semibold">{user?.fullName}</span>.
          Manage the platform below.
        </p>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          {["users", "lectures", "analytics"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                tab === t
                  ? "bg-green-600 text-white"
                  : "bg-white text-green-600 border border-green-200"
              } transition`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Users */}
        {tab === "users" && (
          <>
            {users.length === 0 ? (
              <p className="text-gray-500">No users found.</p>
            ) : (
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
                      <p className="text-sm">Role: {u.role}</p>
                      <p className="text-sm">Email: {u.email}</p>
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
          </>
        )}

        {/* Lectures */}
        {tab === "lectures" && (
          <>
            {lectures.length === 0 ? (
              <p className="text-gray-500">No lectures found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {lectures.map((lec) => (
                  <div
                    key={lec._id}
                    className="card bg-white shadow border border-green-100"
                  >
                    <div className="card-body">
                      <h2 className="card-title text-green-700">{lec.title}</h2>
                      <p className="text-sm">Subject: {lec.subject}</p>
                      <p className="text-sm">
                        Uploaded By: {lec.uploadedBy?.fullName || "Unknown"}
                      </p>
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
          </>
        )}

        {/* Analytics */}
        {tab === "analytics" && (
          <div className="bg-white p-6 rounded shadow border border-green-100 text-gray-700">
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
              <li>
                Most recent lecture:{" "}
                {lectures.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )[0]?.title || "N/A"}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
