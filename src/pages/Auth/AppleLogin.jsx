import React, { useEffect } from "react";

const AppleLogin = ({ onLogin }) => {
  useEffect(() => {
    window.AppleID.auth.init({
      clientId: "com.your.webapp.service",
      scope: "name email",
      redirectURI: "https://bc.damxstudio.com/auth/apple/callback",
      usePopup: true,
    });
  }, []);

  const handleAppleLogin = async () => {
    try {
      const response = await window.AppleID.auth.signIn();
      const res = await fetch("https://bc.damxstudio.com/api/auth/apple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: response.authorization.code }),
      });
      const data = await res.json();
      onLogin(data.userId);
    } catch (err) {
      console.error("Apple login failed", err);
    }
  };

  return (
    <button onClick={handleAppleLogin} className="px-4 py-2 bg-black text-white rounded">
      Sign in with Apple
    </button>
  );
};

export default AppleLogin;
