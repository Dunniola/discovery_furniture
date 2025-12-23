import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserAuthProvider } from "./context/UserAuthContext";
import Sidebar from "./components/Sidebar";
import PriceComparison from "./components/PriceComparison";
import MoodBoard from "./components/MoodBoard";
import MoodBoardDiscover from "./components/MoodBoardDiscover";
import { Toaster } from "react-hot-toast";
 import UserLogin from "./pages/Auth/UserLogin";
import UserRegister from "./pages/Auth/UserRegister";
// import ProtectedRoute from "./context/ProtectedRoute";
 // ✅ Add this
       // You already have this


// Dashboard layout
const DashboardLayout = () => {
  const [active, setActive] = useState("Discover");

  const renderContent = () => {
    switch (active) {
      case "Discover":
        return <MoodBoardDiscover />;
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
      <main className="flex-1 p-8 overflow-auto">{renderContent()}</main>
    </div>
  );
};

const App = () => {
  return (
    <UserAuthProvider>
      <Router>
        <Toaster position="top-center" reverseOrder={false} />

        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          {/* <Route path="/auth/google/callback" element={<GoogleCallback />} /> */}


          <Route
            path="/*"
            element={
              // <ProtectedRoute>
                <DashboardLayout />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserAuthProvider>
  );
};

export default App;
