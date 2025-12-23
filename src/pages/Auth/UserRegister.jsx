import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserRegister = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://api.damxstudio.com/api"; // Laravel backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/member/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (response.ok && result?.status === "success") {
        toast.success(
          "Registration successful! Please verify your email before logging in."
        );
        // After successful registration, redirect to login page
        setTimeout(() => {
          navigate("/login");
        }, 3000);
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
    <div className="flex items-center justify-center min-h-screen bg-[#030616] px-4 sm:px-6 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm sm:max-w-md bg-[#fcff53] rounded-2xl shadow-2xl p-5 sm:p-8 md:p-10 flex flex-col justify-center"
      >
        <h2 className="mb-6 text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#030616]">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 border border-[#8d2726] rounded-lg text-[#030616] bg-white"
          required
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 border border-[#8d2726] rounded-lg text-[#030616] bg-white"
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 border border-[#8d2726] rounded-lg text-[#030616] bg-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 sm:p-4 mb-4 border border-[#8d2726] rounded-lg text-[#030616] bg-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 sm:py-4 mt-2 font-semibold rounded-lg text-[#fcff53] text-base sm:text-lg ${
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
