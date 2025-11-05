import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

const LoginPage = ({ onLogin }) => {
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await fetch("https://bc.damxstudio.com/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      // set userId in context/state
      onLogin(data.userId);
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
};

export default LoginPage;
