import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const handleOnClick = (e) => {
    e.preventDefault();
    navigate("/");
  };
  return (
    <div className="absolute top-0 right-0 pt-1">
      <button
        onClick={handleOnClick}
        className="text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#F7BE38]/50 mr-2 mb-2
      "
      >
        Logout
      </button>
    </div>
  );
}
