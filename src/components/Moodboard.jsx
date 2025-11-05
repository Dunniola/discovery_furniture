import React, { useEffect, useState } from "react";

const MoodBoard = ({ userId }) => {
  const colors = {
    primary: "#030616",
    secondary: "#8d2726",
    accent: "#fcff53",
  };

  const [savedImages, setSavedImages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Automatically switch to live API in production
  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://admin.damxstudio.com");

  const loadGuestItems = () => {
    try {
      const raw = localStorage.getItem("guest_moodboard");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Failed to read guest_moodboard:", err);
      return [];
    }
  };

  const fetchSavedImages = async () => {
    setLoading(true);
    setMessage("");

    if (userId) {
      try {
        const res = await fetch(`${BASE_URL}/api/moodboard/${userId}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();

        const serverItems = data.savedImages || [];
        const guestItems = loadGuestItems();

        // Merge unique items
        const urls = new Set(serverItems.map((i) => i.image_url));
        const merged = [
          ...serverItems,
          ...guestItems.filter((g) => !urls.has(g.image_url)),
        ];

        setSavedImages(merged);
        if (merged.length === 0)
          setMessage("You haven’t saved any moodboard items yet.");
      } catch (err) {
        console.error(err);
        setMessage("Failed to load your moodboard from server.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const guestItems = loadGuestItems();
    if (guestItems.length === 0) {
      setMessage(
        "Please log in to save moodboard items (guest items appear here if any)."
      );
    }
    setSavedImages(guestItems);
    setLoading(false);
  };

  const fetchUserActivities = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${BASE_URL}/api/user-activity`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();
      setActivities(data.data || []);
    } catch (err) {
      console.error("Failed to fetch user activities:", err);
    }
  };

  useEffect(() => {
    fetchSavedImages();
    fetchUserActivities();
  }, [userId]);

  return (
    <div className="md:p-6 bg-gray-50 min-h-screen">
      <h2
        className="text-2xl font-bold mb-4 max-md:mt-10"
        style={{ color: colors.primary }}
      >
        My MoodBoard
      </h2>

      {loading && (
        <p style={{ color: colors.secondary }} className="mb-4">
          Loading your saved moodboard...
        </p>
      )}
      {!loading && message && (
        <p style={{ color: colors.primary }} className="mb-4">
          {message}
        </p>
      )}

      {!loading && savedImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {savedImages.map((img, idx) => (
            <div
              key={img.id || img.image_url || idx}
              className="border bg-white p-2 rounded shadow hover:shadow-lg transition"
              style={{ borderColor: colors.secondary }}
            >
              <img
                src={img.image_url}
                alt={img.keyword || "Saved item"}
                className="w-full h-48 object-cover rounded"
              />
              <p
                className="mt-2 font-semibold"
                style={{ color: colors.primary }}
              >
                {img.title}
              </p>
              {/* <p className="text-sm text-gray-600">{img.description}</p> */}
              {/* <p
                className="text-xs italic"
                style={{ color: colors.secondary }}
              >
                {img.material} – {img.type}
              </p> */}
            </div>
          ))}
        </div>
      )}

      {userId && activities.length > 0 && (
        <div className="mt-8">
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: colors.primary }}
          >
            Recent Activities
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {activities.map((act, idx) => (
              <li key={act.id || idx} style={{ color: colors.secondary }}>
                {act.action}{" "}
                {act.details ? `(${JSON.stringify(act.details)})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MoodBoard;
