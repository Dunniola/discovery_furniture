import React, { useState } from "react";
import { FiUser, FiLogOut } from "react-icons/fi"; // user and logout icons

const Sidebar = ({ activeCategory, onCategorySelect }) => {
  const categories = ["Discover", "Colour Sleuth", "Price Comparison", "Mood Board"];

  const primaryColor = "#030616"; // dark blue
  const secondaryColor = "#8d2726"; // red
  const highlightColor = "#fcff53"; // yellow

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // mock login state

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Log out
      setIsLoggedIn(false);
      window.location.href = "/"; // redirect after logout
    } else {
      // Log in
      window.location.href = "/login"; // redirect to login page
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex w-64 min-h-screen p-6 flex-col gap-6 fixed right-0 top-0 shadow-lg font-bold"
        style={{ backgroundColor: primaryColor, color: secondaryColor }}
      >
        <ul className="flex flex-col gap-4 flex-1">
          {categories.map((category) => (
            <li
              key={category}
              className="cursor-pointer p-3 rounded-lg transition"
              onClick={() => onCategorySelect(category)}
              style={
                activeCategory === category
                  ? { backgroundColor: highlightColor, color: primaryColor, fontWeight: "bold" }
                  : { color: secondaryColor }
              }
              onMouseEnter={(e) => {
                if (activeCategory !== category) e.currentTarget.style.backgroundColor = "#ffffff20";
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== category) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {category}
            </li>
          ))}
        </ul>

        {/* Desktop login/logout icon */}
        <button
          onClick={handleAuthClick}
          className="text-2xl font-bold mt-auto"
          style={{ color: highlightColor }}
        >
          {isLoggedIn ? <FiLogOut /> : <FiLogOut/>}
        </button>
      </aside>

      {/* Mobile Top Bar */}
      <div
        className="md:hidden fixed w-full p-4 flex justify-between items-center shadow-lg font-bold"
        style={{ backgroundColor: primaryColor, color: secondaryColor }}
      >
        <img src="/damx.png" alt="" className="w-10" />

        <div className="flex items-center gap-4">
          {/* Hamburger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl font-bold"
            style={{ color: highlightColor }}
          >
            {isOpen ? "✕" : "☰"}
          </button>

          {/* Mobile login/logout icon */}
          <button
            onClick={handleAuthClick}
            className="text-2xl font-bold"
            style={{ color: highlightColor }}
          >
            {isLoggedIn ? <FiLogOut /> : <FiLogOut />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul
          className="md:hidden flex flex-col gap-2 mt-16 p-4 fixed right-0 w-[20rem] h-full shadow-lg z-50"
          style={{ backgroundColor: primaryColor }}
        >
          {categories.map((category) => (
            <li
              key={category}
              className="cursor-pointer p-3 rounded-lg transition"
              onClick={() => {
                onCategorySelect(category);
                setIsOpen(false);
              }}
              style={
                activeCategory === category
                  ? { backgroundColor: highlightColor, color: primaryColor, fontWeight: "bold" }
                  : { color: secondaryColor }
              }
            >
              {category}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Sidebar;
