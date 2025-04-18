// src/Components/common/NotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Error from "../../assets/images/error.jpg"; // Dummy import - replace with your illustration

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <img
          src={Error}
          alt="404 Illustration"
          className="mx-auto w-76 h-76 object-contain mb-6"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-lg text-gray-600 mb-6">
          We couldn't find the page you're looking for. It might have been moved
          or doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
