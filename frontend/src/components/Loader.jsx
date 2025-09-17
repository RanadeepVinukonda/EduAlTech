//Loader.jsx
import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-base-100">
      <span className="loading loading-spinner loading-lg text-green-500"></span>
      <p className="text-lg text-gray-600 animate-pulse">{message}</p>
    </div>
  );
};

export default Loader;
