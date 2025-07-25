import React from "react";
import { useAuth } from "../context/AuthProvider";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router";

export default function Profile() {
  const { user } = useAuth();
  const nav = useNavigate();

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      {/* Cover + Profile Image */}
      <div className="relative rounded-lg overflow-hidden shadow-lg bg-white">
        <img
          src={user.coverImg || "https://placehold.co/800x200?text=Cover+Image"}
          alt="cover"
          className="w-full h-40 sm:h-48 object-cover"
        />

        {/* Edit Button */}
        <button
          onClick={() => nav("/updateprofile")}
          className="absolute top-3 right-3 bg-white text-green-600 p-2 rounded-full shadow hover:bg-green-100 transition"
          title="Edit Profile"
        >
          <FaEdit />
        </button>

        {/* Profile Image */}
        <div className="absolute left-4 -bottom-12 sm:-bottom-10">
          <img
            src={
              user.profileImg ||
              `https://placehold.co/120x120?text=${user.username}`
            }
            alt="profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      {/* Details */}
      <div className="mt-16 sm:mt-20 bg-white p-6 rounded-lg shadow border border-green-100">
        <h2 className="text-xl sm:text-2xl font-bold text-green-600">
          {user.fullName || "Not Provided"}
        </h2>
        <p className="text-gray-500 mb-4 text-sm sm:text-base">
          @{user.username || "Not Provided"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm sm:text-base">
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
            <p>
              {user.link ? (
                <a
                  href={user.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline break-words"
                >
                  {user.link}
                </a>
              ) : (
                "Not Provided"
              )}
            </p>
          </div>

          <div>
            <span className="font-semibold">Role:</span>
            <p className="capitalize">{user.role || "Not Provided"}</p>
          </div>
        </div>

        <div className="mt-4">
          <span className="font-semibold">Bio:</span>
          <p className="whitespace-pre-wrap">{user.bio || "Not Provided"}</p>
        </div>
      </div>
    </div>
  );
}
