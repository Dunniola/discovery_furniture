// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserAuthProvider, useUserAuth } from "./context/UserAuthContext";
import Sidebar from "./components/Sidebar";
// import ColourSleuth from "./components/ColourSleuth";
import PriceComparison from "./components/PriceComparison";
import MoodBoard from "./components/MoodBoard";
import MoodBoardDiscover from "./components/MoodBoardDiscover";
import { Toaster } from "react-hot-toast";
import UserLogin from "./pages/Auth/UserLogin";
import UserRegister from "./pages/Auth/UserRegister";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { member } = useUserAuth();
  return member ? children : <Navigate to="/login" replace />;
};

// Dashboard layout
const DashboardLayout = () => {
  const [active, setActive] = useState("Discover");

  const renderContent = () => {
    switch (active) {
      case "Discover":
        return <MoodBoardDiscover />;
      // case "Colour Sleuth":
      //   return <ColourSleuth />;
      case "Price Comparison":
        return <PriceComparison />;
      case "Mood Board":
        return <MoodBoard />;
      default:
        return <MoodBoardDiscover />;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-200">
      <Sidebar activeCategory={active} onCategorySelect={setActive} />
      <main className="flex-1 p-8 overflow-auto md:mr-60">{renderContent()}</main>
    </div>
  );
};

const App = () => {
  return (
    <UserAuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserAuthProvider>
  );
};

export default App;
