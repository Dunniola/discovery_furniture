import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Footer from "./Footer";

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

  /* ---------------------------------------------------
     Helpers
  --------------------------------------------------- */

  const isDuplicate = (item, list) => {
    return list.some((i) => i.image_url === item.image_url);
  };

  const loadGuestItems = () => {
    try {
      const raw = localStorage.getItem("guest_moodboard");
      if (!raw) return [];

      return JSON.parse(raw).map((i) => ({
        id: i.id,
        image_url: i.image_url || i.image,
        title: i.title || "Untitled",
        type: i.type || "",
        material: i.material || "",
        price: i.price || 0,
        website_url: i.website_url || "#",
        guest: true,
      }));
    } catch {
      return [];
    }
  };

  /* ---------------------------------------------------
     Fetch Moodboard Items
  --------------------------------------------------- */

  const fetchSavedImages = async () => {
    setLoading(true);
    setMessage("");

    if (userId) {
      try {
        const res = await fetch(`${BASE_URL}/api/moodboard/${userId}`);
        if (!res.ok) throw new Error();

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

        const mergedMap = new Map();

        serverItems.forEach((i) => mergedMap.set(i.image_url, i));
        loadGuestItems().forEach((g) => {
          if (!mergedMap.has(g.image_url)) mergedMap.set(g.image_url, g);
        });

        const merged = [...mergedMap.values()];
        setSavedImages(merged);

        if (merged.length === 0)
          setMessage("You haven’t saved any moodboard items yet.");
      } catch {
        setMessage("Failed to load moodboard.");
      } finally {
        setLoading(false);
      }
      return;
    }

    const guestItems = loadGuestItems();
    setSavedImages(guestItems);
    if (!guestItems.length) setMessage("Login to save moodboard items");
    setLoading(false);
  };

  /* ---------------------------------------------------
     SAVE ITEM (WITH DUPLICATE CHECK)
  --------------------------------------------------- */

  const saveItem = async (item) => {
    // FRONTEND DUPLICATE CHECK
    if (isDuplicate(item, savedImages)) {
      setMessage("This item is already saved to your moodboard.");
      return;
    }

    if (!userId) {
      // Guest Save
      const updated = [...loadGuestItems(), { ...item, guest: true }];
      localStorage.setItem("guest_moodboard", JSON.stringify(updated));
      setSavedImages(updated);
      return;
    }

    // Authenticated Save
    try {
      const res = await fetch(`${BASE_URL}/api/moodboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, ...item }),
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();
      setSavedImages((prev) => [...prev, saved]);
    } catch {
      setMessage("Unable to save item.");
    }
  };

  /* ---------------------------------------------------
     DELETE
  --------------------------------------------------- */

  const deleteItem = (img) => {
    if (img.guest) {
      const filtered = loadGuestItems().filter((i) => i.id !== img.id);
      localStorage.setItem("guest_moodboard", JSON.stringify(filtered));
    } else if (userId) {
      fetch(`${BASE_URL}/api/moodboard/${img.id}`, { method: "DELETE" });
    }

    setSavedImages((prev) => prev.filter((i) => i.id !== img.id));
  };

  /* ---------------------------------------------------
     Activities
  --------------------------------------------------- */

  const fetchUserActivities = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${BASE_URL}/api/user-activity`);
      const data = await res.json();
      setActivities(data.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchSavedImages();
    fetchUserActivities();
  }, [userId]);

  /* ---------------------------------------------------
     UI
  --------------------------------------------------- */

  return (
    <>
      {/* Added top padding to prevent content from going under the navbar */}
      <div className="min-h-screen w-full bg-blue-200 p-6 pt-20 md:pt-24 md:mt-0 z-0">
        {loading && (
          <p style={{ color: colors.secondary }}>
            Loading your saved moodboard...
          </p>
        )}

        {!loading && message && (
          <div className="text-center mt-8">
            <p className="text-lg font-semibold" style={{ color: colors.primary }}>
              {message}
            </p>

            {!userId && (
              <div className="mt-4 flex justify-center gap-4">
                <Link
                  to="/login"
                  className="px-6 py-2 rounded font-semibold"
                  style={{
                    backgroundColor: colors.secondary,
                    color: colors.accent,
                  }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-6 py-2 rounded border font-semibold"
                  style={{
                    borderColor: colors.secondary,
                    color: colors.secondary,
                  }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

        {!loading && savedImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {savedImages.map((img) => (
              <div
                key={img.id}
                className="border bg-white rounded shadow relative"
                style={{ borderColor: colors.secondary }}
              >
                <img src={img.image_url} alt={img.title} className="w-full" />

                <div className="p-2">
                  <p
                    className="font-semibold"
                    style={{ color: colors.primary }}
                  >
                    {img.title}
                  </p>

                  {img.price && (
                    <p style={{ color: colors.secondary }}>
                      ${Number(img.price).toLocaleString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteItem(img)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        {userId && activities.length > 0 && (
          <div className="mt-10">
            <h3
              className="text-xl font-bold"
              style={{ color: colors.primary }}
            >
              Recent Activities
            </h3>
            <ul className="list-disc pl-5">
              {activities.map((act, idx) => (
                <li key={idx} style={{ color: colors.secondary }}>
                  {act.action}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default MoodBoard;