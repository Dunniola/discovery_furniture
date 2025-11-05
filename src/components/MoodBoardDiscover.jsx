import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MoodBoardDiscover = ({ userId }) => {
  const [material, setMaterial] = useState("");
  const [type, setType] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activities, setActivities] = useState([]);
  const [activityLoading, setActivityLoading] = useState(false);

  const IMAGES_PER_PAGE = 6;
  const BASE_URL = "https://api.damxstudio.com/api";

  const colors = {
    primary: "#030616",
    secondary: "#8d2726",
    accent: "#fcff53",
  };

  // Fetch images from server
  const fetchImages = async (filterMaterial = "", filterType = "", pageNumber = 1) => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams({
        ...(filterMaterial && { material: filterMaterial }),
        ...(filterType && { type: filterType }),
        limit: IMAGES_PER_PAGE,
        page: pageNumber,
      }).toString();

      const res = await fetch(`${BASE_URL}/moodboard-discover?${queryParams}`);
      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();
      const imagesData = data.images || [];
      const totalRecords = data.total || imagesData.length;

      if (imagesData.length === 0) {
        setImages([
          {
            tempId: "no-image",
            image_url: "https://via.placeholder.com/300x200?text=No+Image",
            title: "No Image Found",
            description: "No image matches your selection",
            keyword: filterMaterial || filterType ? `${filterMaterial} ${filterType}` : "All",
            tags: [filterMaterial, filterType],
          },
        ]);
        setTotalPages(1);
      } else {
        setImages(imagesData.map((img, idx) => ({ ...img, tempId: img.id || `discover-${idx}` })));
        setTotalPages(Math.ceil(totalRecords / IMAGES_PER_PAGE));
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch images. Please check your server connection.");
      setImages([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user activities
  const fetchActivities = async () => {
    if (!userId) return;
    setActivityLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user-activity?user_id=${userId}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setActivities(data.data || []);
    } catch (err) {
      console.error("❌ Activity fetch error:", err);
      toast.error("Failed to fetch user activity.");
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    fetchImages("", "", 1);
    fetchActivities();
  }, []);

  const handleFilter = () => {
    setPage(1);
    fetchImages(material, type, 1);
  };

  const handleNext = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchImages(material, type, nextPage);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      const prevPage = page - 1;
      setPage(prevPage);
      fetchImages(material, type, prevPage);
    }
  };

  // Save image to MoodBoard
  const saveToMoodBoard = async (img) => {
    if (img.tempId === "no-image") {
      toast.error("Cannot save placeholder image");
      return;
    }

    if (userId) {
      try {
        const res = await fetch(`${BASE_URL}/moodboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            image_url: img.image_url,
            title: img.title,
            description: img.description,
            keyword: img.keyword,
            material,
            type,
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

    // Guest user: Save to localStorage
    try {
      const key = "guest_moodboard";
      const existing = JSON.parse(localStorage.getItem(key) || "[]");
      const guestItem = {
        id: `guest-${Date.now()}`,
        image_url: img.image_url,
        title: img.title,
        description: img.description,
        keyword: img.keyword,
        material,
        type,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify([guestItem, ...existing]));
      toast.success("Image saved successfully in moodboard");
    } catch (err) {
      console.error("❌ Local save error:", err);
      toast.error("Failed to save locally.");
    }
  };

  return (
    <div className="grid  min-h-screen bg-gray-50">
      <div className="py-14 ">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.primary }}>
          Discover 
        </h2>

        {/* Filters */}
       
        {/* Images Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {images.map((img) => (
            <div
              key={img.tempId}
              className="border bg-white p-2 rounded shadow hover:shadow-lg transition flex flex-col justify-between"
              style={{ borderColor: colors.secondary }}
            >
              <div>
                <img
                  src={img.image_url}
                  alt={img.keyword}
                  className="w-full h-40 sm:h-48 md:h-48 object-cover rounded-lg"
                />
                <p
                  className="mt-2 font-semibold text-sm sm:text-base truncate"
                  style={{ color: colors.primary }}
                  title={img.title}
                >
                  {img.title.length > 20 ? img.title.slice(0, 20) + "..." : img.title}
                </p>
                {/* <p
                  className="text-xs sm:text-sm text-gray-600 line-clamp-2"
                  title={img.description}
                >
                  {img.description.length > 50
                    ? img.description.slice(0, 50) + "..."
                    : img.description}
                </p> */}
                {/* <p
                  className="italic text-xs truncate"
                  style={{ color: colors.secondary }}
                  title={img.keyword}
                >
                  {img.keyword.length > 15 ? img.keyword.slice(0, 15) + "..." : img.keyword}
                </p> */}
              </div>

              <button
                onClick={() => saveToMoodBoard(img)}
                className="mt-3 px-3 py-1 rounded font-semibold w-full text-sm sm:text-base"
                style={{ backgroundColor: colors.primary, color: colors.accent }}
              >
                Save to MoodBoard
              </button>
            </div>
          ))}
        </div>
         <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 mt-10">
          <select
            className="border p-2 rounded flex-1  "
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
            className="border p-2 rounded flex-1"
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ borderColor: colors.secondary }}
          >
            <option value="">Select Furniture Type</option>
            <option value="chair">Chair</option>
            <option value="table">Table</option>
            <option value="sofa">Sofa</option>
            <option value="bed">Bed</option>
            <option value="shelf">Shelf</option>
          </select>

          <button
            onClick={handleFilter}
            className="px-4 py-2 rounded font-semibold w-full sm:w-auto"
            style={{ backgroundColor: colors.secondary, color: colors.accent }}
          >
            {loading ? "Loading..." : "Beau Chaos"}
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}


        {/* Pagination */}
        {/* <div className="flex md:justify-center items-center  my-12 flex-wrap">
          <button
            onClick={handlePrevious}
            disabled={page === 1}
            className="px-4 py-2 rounded disabled:opacity-50"
            style={{ backgroundColor: colors.secondary, color: colors.accent }}
          >
            Previous
          </button>
          <span className="px-2 py-2 font-semibold">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages || images.length < IMAGES_PER_PAGE}
            className="px-2 py-2 rounded disabled:opacity-50"
            style={{ backgroundColor: colors.secondary, color: colors.accent }}
          >
            Next
          </button>
        </div> */}

        {/* User Activity */}
        {userId && (
          <div className="mt-12 p-4 bg-white rounded shadow">
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
              Your Recent Activities
            </h3>
            {activityLoading ? (
              <p>Loading activities...</p>
            ) : activities.length === 0 ? (
              <p>No recent activity found.</p>
            ) : (
              <ul className="list-disc list-inside">
                {activities.map((act) => (
                  <li key={act.id}>
                    <strong>{act.action}</strong>{" "}
                    {act.details ? `- ${JSON.stringify(act.details)}` : ""}
                    <span className="text-gray-400 text-xs ml-2">
                      ({new Date(act.created_at).toLocaleString()})
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default MoodBoardDiscover;
