import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";

const Sidebar = ({ activeCategory, onCategorySelect }) => {
  const categories = ["Discover", "Price Comparison", "Mood Board"];

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      window.location.href = "/";
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* --------------------- DESKTOP NAVBAR --------------------- */}
     <nav className="hidden md:flex w-full px-6 py-4 fixed top-0 left-0 items-center justify-between z-0 uppercase">

  {/* LEFT: LOGO */}
  <div className="">
    <img src="/damx.png" alt="Logo" className="w-[3rem] cursor-pointer" />
  </div>

  {/* RIGHT: CATEGORIES + LOGOUT */}
  <div className="flex items-center gap-2">
    {/* CATEGORIES */}
    <ul className="flex gap-2 items-center text-sm  font-semibold">
      {categories.map((category) => {
        const isActive = activeCategory === category;

        return (
          <li
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`
              cursor-pointer p-3  transition duration-200 border-b-4 border-transparent
              ${isActive ? "border-b-[#8d2726] font-bold text-[#8d2726]" : "text-[#8d2726]"}
              hover:border-[#6a1b1b] hover:border-dashed
            `}
          >
            {category}
          </li>
        );
      })}
    </ul>

    {/* LOGOUT */}
    <button
      onClick={handleAuthClick}
      className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold  transition text-[#8d2726] pointer"
    >
       <FiLogOut />
    </button>
  </div>
</nav>


      {/* --------------------- MOBILE TOP BAR --------------------- */}
      <div className="md:hidden fixed w-full p-4 flex justify-between items-center font-bold z-50 bg-blue-200">

        {/* MOBILE LOGO */}
        <img src="/damx.png" alt="Logo" className="w-[2.5rem] cursor-pointer" />

        <div className="flex items-center gap-4">
          {/* NAV TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-2xl font-bold text-[#8d2726]"
          >
            {isOpen ? "✕" : "☰"}
          </button>

          {/* LOGOUT */}
          <button
            onClick={handleAuthClick}
            className="text-2xl font-bold text-[#8d2726]"
          >
            <FiLogOut />
          </button>
        </div>
      </div>

      {/* --------------------- MOBILE SLIDING SIDEBAR --------------------- */}
      <div
        className={`md:hidden fixed top-0 left-0 w-[20rem] h-full shadow-lg z-50 bg-white transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* LOGO */}
        <div className="p-4 mt-6">
          <img src="/damx.png" alt="Logo" className="w-[3rem] cursor-pointer" />
        </div>

        {/* MENU LIST */}
        <ul className="flex flex-col gap-2 mt-4 p-4 font-semibold ">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <li
                key={category}
                onClick={() => {
                  onCategorySelect(category);
                  setIsOpen(false);
                }}
                className={`
    cursor-pointer p-3  transition duration-200 border-b-4 border-transparent
    ${isActive ? " font-bold text-[#8d2726]" : "text-[#8d2726]"}
    
  `}
              >
                {category}
              </li>

            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
