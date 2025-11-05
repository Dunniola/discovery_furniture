import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">BC Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome, User 👋</span>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-md">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
