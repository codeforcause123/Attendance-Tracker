import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const handleOnClick = (e) => {
    e.preventDefault();
    localStorage.removeItem("attData");
    navigate("/");
  };
  return (
    <div className="absolute top-0 right-0 pt-1">
      <button
        onClick={handleOnClick}
        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700
      "
      >
        Logout
      </button>
    </div>
  );
}
