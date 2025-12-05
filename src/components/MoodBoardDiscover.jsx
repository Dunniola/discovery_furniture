import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash } from "react-icons/fa";


const MoodBoardDiscover = ({ userId }) => {
  const [material, setMaterial] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = "https://api.damxstudio.com/api";

  const colors = {
    primary: "#030616",
    secondary: "#8d2726",
    accent: "#fcff53",
  };

  // Fetch images from API
  const fetchImages = async (filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        latest: true,
      }).toString();

      const res = await fetch(`${BASE_URL}/moodboard-discover?${queryParams}`);
      if (!res.ok) throw new Error("Failed to fetch images");

      const data = await res.json();
      const imagesData = data.images || [];

      if (imagesData.length === 0) {
        setImages([
          {
            tempId: "no-image",
            image: "https://via.placeholder.com/300x200?text=No+Image",
            title: "No Image Found",
            type: "",
            material: "",
            website_url: "#",
          },
        ]);
      } else {
        setImages(
          imagesData.map((img, idx) => ({
            ...img,
            tempId: img.id || `discover-${idx}`,
          }))
        );
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch images from server");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest images on load
  useEffect(() => {
    fetchImages();
  }, []);

  // Save image to MoodBoard (backend or guest localStorage)
  const saveToMoodBoard = async (img) => {
    if (img.tempId === "no-image") {
      toast.error("Cannot save placeholder image");
      return;
    }

    const imageToSave =
      img.image_url || img.low_res_image_url || img.image || null;

    if (!imageToSave) {
      toast.error("Image URL missing");
      return;
    }

    // Logged-in user → Save to backend
    if (userId) {
      try {
        const res = await fetch(`${BASE_URL}/moodboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            image: imageToSave,
            title: img.title,
            type: img.type,
            material: img.material,
            website_url: img.website_url,
          }),
        });

        if (!res.ok) throw new Error("Failed to save image");

        toast.success("Image added successfully!");
      } catch (err) {
        console.error("❌ Save error:", err);
        toast.error("Failed to save image to server.");
      }
      return;
    }

    // Guest → Save locally
    try {
      const key = "guest_moodboard";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");

      const guestItem = {
        id: `guest-${Date.now()}`,
        image: imageToSave,
        title: img.title,
        type: img.type,
        material: img.material,
        website_url: img.website_url,
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(key, JSON.stringify([guestItem, ...existing]));
      toast.success("Image saved to your MoodBoard");
    } catch (err) {
      console.error("❌ Local save error:", err);
      toast.error("Failed to save locally.");
    }
  };

  // Ask before clearing guest MoodBoard
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
            className="px-3 py-1 bg-red-600 text-white rounded font-semibold"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-400 text-white rounded font-semibold"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <div className={`m-0 py-14 bg-blue-200 md:mt-16`}>
      {/* <h2
        className="text-2xl font-bold mb-6 text-center"
        style={{ color: colors.primary }}
      >
        Discover MoodBoard
      </h2> */}

      {/* Images Grid */}
      {loading ? (
        <p className="text-center text-primary">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-">
          {images.map((img) => (
            <div
              key={img.tempId}
              className="border bg-white p-2 rounded shadow hover:shadow-lg transition flex flex-col justify-between"
              style={{ borderColor: colors.secondary }}
            >
              {/* FIXED IMAGE URL */}
              <img
                src={img.image_url || img.low_res_image_url || img.image}
                className="w-full object-cover rounded-lg"
                alt={img.title}
              />

              <div className="mt-2">
                <p
                  className="font-semibold text-sm sm:text-base"
                  style={{ color: colors.primary }}
                >
                  {img.title}
                </p>
                <p className="text-xs text-gray-600">
                  {img.type && `Type: ${img.type}`}{" "}
                  {img.material && `| Material: ${img.material}`}
                </p>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <a
                  href={img.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded font-semibold text-[1rem] w-full hover:text-red-600 transition-colors underline"
                >
                  Visit Website
                </a>

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
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <select
          className="border p-2 rounded flex-1 bg-white"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          style={{ borderColor: colors.secondary }}
        >
          <option value="">Select Material</option>
          <option value="wood">Wood</option>
          <option value="metal">Metal</option>
          <option value="glass">Glass</option>
          <option value="fabric">Fabric</option>
          <option value="leather">Leather</option>
        </select>

        <select
          className="border p-2 rounded flex-1 bg-white"
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ borderColor: colors.secondary }}
        >
          <option value="">Select Type</option>
          <option value="chair">Chair</option>
          <option value="table">Table</option>
          <option value="sofa">Sofa</option>
          <option value="bed">Bed</option>
          <option value="stool">Stool</option>
          <option value="shelf">Shelf</option>
        </select>

        <button
          onClick={() => fetchImages({ material, type })}
          className="px-2 py-2 rounded font-semibold text-sm sm:text-base"
          style={{ backgroundColor: colors.primary, color: colors.accent }}
        >
          Data
        </button>
      </div>

      {/* Floating Clear MoodBoard Icon */}
      <button
        onClick={confirmClearMoodBoard}
        className="fixed bottom-5 right-5 p-2 rounded-full shadow-lg hover:scale-110 transition"
        style={{ backgroundColor: "#dc2626", color: colors.accent, zIndex: 50 }}
        title="Clear MoodBoard"
      >
        <FaTrash size={16} />
      </button>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default MoodBoardDiscover;
