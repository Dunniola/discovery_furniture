import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserRegister = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://api.damxstudio.com/api"; // ✅ Laravel backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok && result?.success) {
        toast.success(result.message || "Registration successful!");
        setTimeout(() => {
          navigate("/user-login");
        }, 1200);
      } else {
        toast.error(result?.message || "Unable to register, please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#030616] relative px-4 sm:px-6 md:px-8">
      {/* ✅ Logo */}
      <a href="https://damxstudio.com" target="_blank" rel="noopener noreferrer">
        <img
          src="/damx.png"
          alt="Damx Logo"
          className="absolute w-1 sm:w-14 sm:h-14 md:w-16 md:h-16 top-4 right-4 sm:top-6 sm:right-6"
        />
      </a>

      {/* ✅ Registration Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md bg-[#fcff53] rounded-2xl shadow-2xl p-5 sm:p-8 md:p-10 flex flex-col justify-center"
        style={{
          filter: "brightness(1.05) contrast(1.1)",
        }}
      >
        <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#030616]">
          Create Account
        </h2>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 border border-[#8d2726] rounded-lg text-[#030616] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#8d2726] bg-white"
          required
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 border border-[#8d2726] rounded-lg text-[#030616] text-sm bg-white sm:text-base focus:outline-none focus:ring-2 focus:ring-[#8d2726]"
          required
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 border border-[#8d2726] rounded-lg text-[#030616] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#8d2726] bg-white"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 sm:py-4 mt-2 font-semibold rounded-lg text-[#fcff53] text-base sm:text-lg transition-all duration-200 ${
            loading
              ? "bg-[#6a1b1b] cursor-not-allowed opacity-80"
              : "bg-[#8d2726] hover:bg-[#6a1b1b] hover:scale-[1.02]"
          }`}
        >
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default UserRegister;
