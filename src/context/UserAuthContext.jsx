// src/context/UserAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth token on mount
  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (token) {
      // Optional: Fetch member data from backend
      axios
        .get("https://data.damxstudio.com/api/member/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMember(res.data))
        .catch(() => setMember(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (token, memberData) => {
    Cookies.set("auth_token", token, { expires: 1 }); // 1 day
    setMember(memberData);
  };

  const logoutUser = () => {
    Cookies.remove("auth_token");
    setMember(null);
  };

  return (
    <UserAuthContext.Provider
      value={{ member, loginUser, logoutUser, loading }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
