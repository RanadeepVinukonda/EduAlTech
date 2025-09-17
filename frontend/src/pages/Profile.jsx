// Profile.jsx
import React from "react";
import { useAuth } from "../context/AuthProvider";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function Profile() {
  const { user } = useAuth();
  const nav = useNavigate();

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      {/* Cover + Profile Image */}
      <div className="relative bg-white shadow rounded-lg overflow-hidden">
        <div className="relative h-52 sm:h-64 w-full">
          <img
            src={
              user.coverImg || "https://placehold.co/800x200?text=Cover+Image"
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-6">
            <img
              src={
                user.profileImg ||
                `https://placehold.co/120x120?text=${user.username}`
              }
              alt="Profile"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow object-cover bg-white"
            />
          </div>
          <button
            onClick={() => nav("/updateprofile")}
            className="absolute top-4 right-4 bg-white text-green-600 p-2 rounded-full shadow-md hover:bg-green-100 transition"
            title="Edit Profile"
          >
            <FaEdit />
          </button>
        </div>
      </div>

      {/* User Details */}
      <div className="mt-20 bg-white border border-green-100 shadow p-6 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-600">
          {user.fullName || "Not Provided"}
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-4">
          @{user.username || "Not Provided"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div>
            <span className="font-semibold">Email:</span>
            <p>{user.email || "Not Provided"}</p>
          </div>
          <div>
            <span className="font-semibold">Phone:</span>
            <p>{user.phone || "Not Provided"}</p>
          </div>
          <div>
            <span className="font-semibold">Address:</span>
            <p>{user.address || "Not Provided"}</p>
          </div>
          <div>
            <span className="font-semibold">Link:</span>
            {user.link ? (
              <a
                href={user.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {user.link}
              </a>
            ) : (
              "Not Provided"
            )}
          </div>
          <div>
            <span className="font-semibold">Role:</span>
            <p className="capitalize">{user.role || "Not Provided"}</p>
          </div>
        </div>

        <div className="mt-4">
          <span className="font-semibold">Bio:</span>
          <p>{user.bio || "Not Provided"}</p>
        </div>
      </div>
    </div>
  );
}
