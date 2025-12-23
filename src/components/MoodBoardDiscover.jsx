"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";
import Footer from "./Footer";

const MoodBoardDiscover = ({ userId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [material, setMaterial] = useState("");
  const [furnitureType, setFurnitureType] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const containerRef = useRef(null);

  const BASE_URL = "https://api.damxstudio.com/api";
  const POSTS_PER_LOAD = 6;

  const colors = {
    primary: "#8d2726", // Brand maroon
    accent: "#fcff53", // Brand yellow
    secondary: "#030616",
  };

  // Fetch images
  const fetchImages = async (pageNum = 1, filters = {}) => {
    setLoading(true);
    setError("");

    try {
      const queryParams = new URLSearchParams({
        ...filters,
        latest: true,
        page: pageNum,
        limit: POSTS_PER_LOAD,
      }).toString();

      const res = await fetch(`${BASE_URL}/moodboard-discover?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch images");

      const data = await res.json();
      const imagesData = data.images || [];

      if (imagesData.length === 0 && pageNum === 1) {
        setImages([
          {
            tempId: "no-image",
            image: "https://via.placeholder.com/300x200?text=No+Image",
            title: "No Image Found",
          },
        ]);
      } else {
        setImages((prev) => [
          ...prev,
          ...imagesData.map((img, idx) => ({
            ...img,
            tempId: img.id || `discover-${prev.length + idx}`,
          })),
        ]);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch images from server");
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial images or when page changes
  useEffect(() => {
    fetchImages(page, { material, type: furnitureType });
  }, [page]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [loading]);

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      return () => ref.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Save to MoodBoard
  const saveToMoodBoard = async (img) => {
    const imageSrc = img.image || img.image_url || img.low_res_image_url;
    if (!imageSrc) return toast.error("Image missing");

    if (userId) {
      try {
        await fetch(`${BASE_URL}/moodboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, ...img, image: imageSrc }),
        });
        toast.success("Image added successfully!");
      } catch {
        toast.error("Failed to save image.");
      }
      return;
    }

    // Show auth modal for guest users
    setShowAuthModal(true);
  };

  // Clear MoodBoard
  const confirmClearMoodBoard = () => {
    toast.info(
      <div className="flex flex-col gap-2">
        <p>Are you sure you want to delete all activities?</p>
        <div className="flex justify-between mt-2">
          <button
            onClick={() => {
              localStorage.removeItem("guest_moodboard");
              setImages([]);
              toast.dismiss();
              toast.success("MoodBoard activities deleted!");
            }}
            className="px-3 py-1 rounded font-semibold"
            style={{ backgroundColor: colors.primary, color: colors.accent }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 rounded font-semibold"
            style={{ backgroundColor: "#ccc", color: colors.secondary }}
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  // Apply filters
  const applyFilters = () => {
    setImages([]);
    setPage(1);
  };

  return (
    <div
      className="m-0 py-14 bg-blue-200 md:mt-16 overflow-auto"
      ref={containerRef}
      style={{ maxHeight: "calc(100vh - 80px)" }}
    >
      {/* Images Grid */}
      {loading && <p className="text-center text-primary">Loading...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4">
        {images.map((img) => (
          <div
            key={img.tempId}
            className="border bg-white p-2 rounded shadow hover:shadow-lg transition flex flex-col justify-between"
            style={{ borderColor: colors.primary }}
          >
            <img
              src={img.image_url || img.low_res_image_url || img.image || "https://via.placeholder.com/300x200"}
              className="w-full object-cover rounded-lg"
              alt={img.title}
            />
            <div className="mt-2">
              <p className="font-semibold text-sm sm:text-base" style={{ color: colors.secondary }}>
                {img.title}
              </p>
              <p className="text-xs text-gray-600">
                {img.type && `Type: ${img.type}`} {img.material && `| Material: ${img.material}`}
              </p>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {img.website_url && (
                <a
                  href={img.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded font-semibold text-[1rem] w-full underline transition-colors"
                  style={{ color: "#030616" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.primary)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#030616")}
                >
                  Visit Website
                </a>
              )}
              <button
                onClick={() => saveToMoodBoard(img)}
                className="px-3 py-1 rounded font-semibold text-sm sm:text-base w-full"
                style={{ backgroundColor: colors.primary, color: colors.accent }}
              >
                Save to MoodBoard
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 md:items-end my-6 w-full px-4">
  {/* Material Select - Full width on mobile, flex-1 on desktop */}
  <div className="w-full md:flex-1">
    <span className="block mb-1 text-sm md:text-base font-medium">
      Select Material:
    </span>
    <select
      className="border p-2 rounded bg-white w-full shadow-sm"
      value={material}
      onChange={(e) => setMaterial(e.target.value)}
    >
      <option value="all">All</option>
      <option value="wood">Wood</option>
      <option value="metal">Metal</option>
      <option value="glass">Glass</option>
      <option value="leather">Leather</option>
      <option value="steel">Steel</option> {/* Fixed duplicate "leather" → "steel" */}
    </select>
  </div>

  {/* Type Select - Full width on mobile, flex-1 on desktop */}
  <div className="w-full md:flex-1">
    <span className="block mb-1 text-sm md:text-base font-medium">
      Select Type:
    </span>
    <select
      className="border p-2 rounded bg-white w-full shadow-sm"
      value={furnitureType}
      onChange={(e) => setFurnitureType(e.target.value)}
    >
      <option value="all">All</option>
      <option value="chair">Chair</option>
      <option value="table">Table</option>
      <option value="sofa">Sofa</option>
      <option value="bed">Bed</option>
      <option value="stool">Stool</option>
      <option value="shelf">Shelf</option>
    </select>
  </div>

  {/* Update Button - Full width on mobile, small & fixed on desktop */}
  <div className="w-full md:w-auto">
    <button
      onClick={applyFilters}
      className="py-2 px-6 rounded font-semibold text-sm md:text-base w-full md:w-auto whitespace-nowrap shadow-md"
      style={{ backgroundColor: colors.primary, color: colors.accent }}
    >
      Update
    </button>
  </div>
</div>

      {/* Floating Clear MoodBoard Icon */}
      <button
        onClick={confirmClearMoodBoard}
        className="fixed bottom-5 right-5 p-2 rounded-full shadow-lg hover:scale-110 transition"
        style={{ backgroundColor: colors.primary, color: colors.accent, zIndex: 50 }}
        title="Clear MoodBoard"
      >
        <FaTrash size={16} color={colors.accent} />
      </button>

      {/* Centered Auth Modal */}
      {/* Centered Auth Modal */}
      {/* Centered Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black opacity-90"
            onClick={() => setShowAuthModal(false)}
          ></div>

          {/* Modal content */}
          <div className="relative bg-white rounded-lg p-6 max-w-sm w-full flex flex-col gap-4 z-10">
            <h2 className="text-lg font-semibold text-center" style={{ color: colors.primary }}>
              Sign In Required
            </h2>
            <p className="text-center">You need to sign in or create an account to save to MoodBoard.</p>

            {/* Buttons stacked vertically */}
            <div className="flex flex-col gap-3 cursor-pointer">
              <button
                onClick={() => (window.location.href = "/login")}
                className="py-2 px-4 rounded font-semibold w-full cursor-pointer"
                style={{ backgroundColor: colors.primary, color: colors.accent }}
              >
                Sign In
              </button>
              <button
                onClick={() => (window.location.href = "/register")}
                className="py-2 px-4 rounded font-semibold border w-full cursor-pointer"
                style={{ borderColor: colors.primary, color: colors.primary }}
              >
                Create Account
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="py-2 px-4 rounded font-semibold border border-gray-400 text-gray-700 w-full cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </div>
  );
};

export default MoodBoardDiscover;
