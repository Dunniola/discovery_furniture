// import React, { useState, useEffect } from "react";
// import {Navigate } from "react-router-dom";
// import { useUserAuth } from "../context/UserAuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { member, loading } = useUserAuth();

//   if (loading) return <div>Loading...</div>;

//   // If user is logged in, redirect to homepage
//   if (member) return <Navigate to="/discover" />;

//   return children; // show register/login page only for new users
// };

// export default ProtectedRoute;
