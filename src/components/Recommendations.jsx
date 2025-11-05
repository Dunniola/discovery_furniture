import React, { useEffect, useState } from "react";
import axios from "axios";

const Recommendations = ({ userId }) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/moodboard/recommend/${userId}`
        );

        setLastSaved(res.data.lastSaved);
        setRecommendations(res.data.recommendations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  if (loading) return <p>Loading recommendations...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Your Recommendations</h2>

      {lastSaved && (
        <div className="mb-6 border p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Last Saved:</h3>
          <img
            src={lastSaved.image_url}
            alt={lastSaved.keyword}
            className="w-full h-48 object-cover rounded"
          />
          <p className="mt-2 font-semibold">{lastSaved.title}</p>
          <p>{lastSaved.description}</p>
          <p className="italic">Tags: {lastSaved.tags.join(", ")}</p>
        </div>
      )}

      <h3 className="font-semibold mb-4">Recommended for You:</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {recommendations.map((item) => (
          <div key={item.id} className="border p-2 rounded shadow">
            <img
              src={item.image_url}
              alt={item.keyword}
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="mt-2 font-semibold">{item.title}</p>
            <p>{item.description}</p>
            <p className="italic">Tags: {item.tags.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
