import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

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

  const BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    (window.location.hostname === "localhost"
      ? "http://127.0.0.1:8000"
      : "https://admin.damxstudio.com");

  // Load guest items from localStorage
  const loadGuestItems = () => {
    try {
      const raw = localStorage.getItem("guest_moodboard");
      if (!raw) return [];
      const items = JSON.parse(raw);
      return items.map((i) => ({
        id: i.id || `guest-${Date.now()}`,
        image_url: i.image || i.image_url,
        title: i.title || "Untitled",
        type: i.type || "",
        material: i.material || "",
        price: i.price || 0,
        website_url: i.website_url || "#",
        guest: true,
      }));
    } catch (err) {
      console.error("Failed to read guest_moodboard:", err);
      return [];
    }
  };

  // Fetch saved images (server + guest)
  const fetchSavedImages = async () => {
    setLoading(true);
    setMessage("");

    if (userId) {
      try {
        const res = await fetch(`${BASE_URL}/api/moodboard/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch server items");
        const data = await res.json();

        const serverItems = (data.savedImages || []).map((i) => ({
          id: i.id,
          image_url: i.image_url || i.image,
          title: i.title || "Untitled",
          type: i.type || "",
          material: i.material || "",
          price: i.price || 0,
          website_url: i.website_url || "#",
          guest: false,
        }));

        const guestItems = loadGuestItems();
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
        setSavedImages(loadGuestItems());
      } finally {
        setLoading(false);
      }
      return;
    }

    // Guest-only
    const guestItems = loadGuestItems();
    if (guestItems.length === 0) {
      setMessage(
        "Please log in to save moodboard items (guest items appear here if any)."
      );
    }
    setSavedImages(guestItems);
    setLoading(false);
  };

  // Delete an item
  const deleteItem = (img) => {
    if (img.guest) {
      // Guest: remove from localStorage
      const existing = loadGuestItems().filter((i) => i.id !== img.id);
      localStorage.setItem("guest_moodboard", JSON.stringify(existing));
    } else {
      // Server: call API to delete
      if (userId) {
        fetch(`${BASE_URL}/api/moodboard/${img.id}`, { method: "DELETE" })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to delete server item");
          })
          .catch((err) => console.error(err));
      }
    }
    // Update state
    setSavedImages((prev) => prev.filter((i) => i.id !== img.id));
  };

  // Fetch user activities
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
    <div className="min-h-screen w-full bg-blue-200 p-6 md:mt-16">
      {/* <h2
        className="text-2xl font-bold mb-4 text-center"
        style={{ color: colors.primary }}
      >
        My MoodBoard
      </h2> */}

      {loading && <p style={{ color: colors.secondary }}>Loading your saved moodboard...</p>}
      {!loading && message && <p style={{ color: colors.primary }}>{message}</p>}

      {!loading && savedImages.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {savedImages.map((img, idx) => (
            <div
              key={img.id || idx}
              className="border bg-white rounded shadow hover:shadow-lg transition relative overflow-hidden"
              style={{ borderColor: colors.secondary }}
            >
              <img
                src={img.image_url}
                alt={img.title || "Saved item"}
                className="w-full  object-cover"
              />
              <div className="p-2 flex flex-col gap-1">
                <p className="font-semibold text-lg" style={{ color: colors.primary }}>
                  {img.title}
                </p>
                {img.price ? (
                  <p className="text-sm" style={{ color: colors.secondary }}>
                    Price: ${Number(img.price).toLocaleString()}
                  </p>
                ) : null}
                {img.type || img.material ? (
                  <p className="text-xs text-gray-600">
                    {img.type && `Type: ${img.type}`}{" "}
                    {img.material && `| Material: ${img.material}`}
                  </p>
                ) : null}
              </div>
              <button
                onClick={() => deleteItem(img)}
                className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white hover:scale-110 transition"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {userId && activities.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.primary }}>
            Recent Activities
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            {activities.map((act, idx) => (
              <li key={act.id || idx} style={{ color: colors.secondary }}>
                {act.action} {act.details ? `(${JSON.stringify(act.details)})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MoodBoard;
