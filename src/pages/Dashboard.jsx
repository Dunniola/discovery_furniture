// import React, { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Discover from "../components/DiscoverAndRecommend";
// import ColourSleuth from "../components/ColourSleuth";
// import PriceComparison from "../components/PriceComparison";

// const Dashboard = () => {
//   const [activeCategory, setActiveCategory] = useState("Discover");

//   return (
//     <div className="flex">
//       {/* Main content */}
//       <main className="flex-1 p-8 mr-64 bg-gray-50 min-h-screen">
//         {activeCategory === "Discover" && <Discover />}
//         {activeCategory === "Colour Sleuth" && <ColourSleuth />}
//         {activeCategory === "Price Comparison" && <PriceComparison />}
//       </main>

//       {/* Sidebar */}
//       <Sidebar
//         activeCategory={activeCategory}
//         onCategorySelect={setActiveCategory}
//       />
//     </div>
//   );
// };

// export default Dashboard;
