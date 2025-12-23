import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUserAuth } from "../../context/UserAuthContext";

const UserLogin = () => {
  const { loginUser } = useUserAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const BASE_URL = "https://api.damxstudio.com/api";

  // Show toast if redirected after verification
  useEffect(() => {
    if (searchParams.get("verified")) {
      toast.success("Email verified! Please log in using your credentials.");
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    setLoadingGoogle(true);
    window.location.href = `${BASE_URL}/auth/google/redirect`;
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoadingEmail(true);

    if (!email.trim() || !password) {
      toast.error("Both email and password are required!");
      setLoadingEmail(false);
      return;
    }

    try {
      // DIRECT LOGIN — NO CHECK EMAIL
      const res = await fetch(`${BASE_URL}/member/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (res.status === 200 && data.status === "success") {
        toast.success(data.message || "Login successful!");

        // Save to context & localStorage
        loginUser(data.data, data.access_token);

        // Redirect to dashboard
        navigate("/");
      } else if (res.status === 401) {
        toast.error("Invalid credentials. Please check your email or password.");
      } else if (res.status === 404) {
        toast.error("Email not registered. Redirecting to register...");
        setTimeout(() => navigate("/register"), 2000);
      } else if (res.status === 403) {
        toast.error("Email not verified. Please check your inbox.");
      } else {
        toast.error(data.message || "Login failed.");
      }

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-8"
      style={{ backgroundColor: "#000F19" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-lg p-8 sm:p-10 flex flex-col items-center"
        style={{ backgroundColor: "#FCFF53" }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: "#8D2726" }}>
          Log in
        </h2>

        <button
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="flex items-center w-full justify-center gap-3 py-3 mb-4 border rounded-lg hover:bg-[#8D2726] hover:text-[#FCFF53] transition-colors"
          style={{ borderColor: "#8D2726", color: "#8D2726", backgroundColor: "transparent" }}
        >
          <FcGoogle size={20} />
          Continue with Google
          {loadingGoogle && (
            <span
              className="ml-2 border-2 border-t-2 border-t-transparent rounded-full w-4 h-4 animate-spin"
              style={{ borderColor: "#8D2726", borderTopColor: "#FCFF53" }}
            ></span>
          )}
        </button>

        <p style={{ color: "#8D2726" }} className="mb-4">
          OR
        </p>

        <form onSubmit={handleEmailLogin} className="w-full flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D2726]"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8D2726]"
          />

          <button
            type="submit"
            disabled={loadingEmail}
            className={`w-full py-3 mt-2 font-bold rounded-lg text-[#FCFF53] transition-colors ${
              loadingEmail ? "bg-[#6a1b1b]" : "bg-[#8D2726]"
            }`}
          >
            {loadingEmail ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;
