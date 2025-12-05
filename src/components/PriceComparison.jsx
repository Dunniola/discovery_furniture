import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Modal from "react-modal";

// Bind modal to app element (required for accessibility)
Modal.setAppElement("#root");

const PriceComparison = () => {
  const colors = ["#030616", "#8d2726", "#fcff53", "#00aaff", "#ff66cc"];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [material, setMaterial] = useState("");
  const [furnitureType, setFurnitureType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  const BASE_URL = "https://api.damxstudio.com/api";

  const color = {
    primary: "#030616",
    secondary: "#8d2726",
    accent: "#fcff53",
  };

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams({
        material,
        type: furnitureType,
      }).toString();

      const res = await axios.get(`${BASE_URL}/moodboard-discover?${queryParams}`);

      if (res.data && Array.isArray(res.data.images)) {
        const mappedData = res.data.images.map((item) => ({
          id: item.id,
          title: item.title || `${item.type || "Unknown"} (${item.material || "Unknown"})`,
          price: item.price || 0,
          lowResImage: item.low_res_image_url || item.low_res_image || null,
          fullImage: item.image_url || item.image || null,
        }));

        setData(mappedData);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Failed to fetch price comparison data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Custom tooltip for hover
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const price = payload[0].value;
      return (
        <div className="bg-white p-2 rounded shadow-md border border-gray-300">
          <p className="text-sm font-bold text-[#030616]">
            ${Number(price).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom bar with image and price label
  const renderBarWithImage = (props) => {
    const { x, y, width, height, payload } = props;
    const imgSize = 28;
    const imgX = x + (width - imgSize) / 2;
    const imgY = y - imgSize - 12;
    const priceY = imgY - 4;

    return (
      <g>
        {/* Bar */}
        <rect x={x} y={y} width={width} height={height} fill={colors[1]} />

        {/* Small image */}
        {payload.lowResImage && (
          <g
            onClick={() => {
              if (payload.fullImage) {
                setModalImage(payload.fullImage);
                setModalOpen(true);
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <clipPath id={`clip-${payload.id}`}>
              <circle cx={imgX + imgSize / 2} cy={imgY + imgSize / 2} r={imgSize / 2} />
            </clipPath>

            <image
              href={payload.lowResImage}
              x={imgX}
              y={imgY}
              width={imgSize}
              height={imgSize}
              clipPath={`url(#clip-${payload.id})`}
            />
          </g>
        )}

        {/* Price label above bar */}
        <text
          x={x + width / 2}
          y={priceY}
          textAnchor="middle"
          fontSize="10"
          fill={colors[0]}
          fontWeight="bold"
        >
          ${Number(payload.price).toLocaleString()}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full min-h-screen md:mt-16">
      <div className="p-4 mt-10">
        {loading ? (
          <p className="text-center text-[#8d2726]">Loading data...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : data.length === 0 ? (
          <p className="text-center text-[#8d2726]">No data found.</p>
        ) : (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={data}
              margin={{ top: 120, right: 20, left: 20, bottom: 120 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="title"
                interval={0}
                angle={-35}
                textAnchor="end"
                tick={{ fontSize: 12 }}
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="price" fill={colors[1]} shape={renderBarWithImage} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {/* Modal for full image */}
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          contentLabel="Full Image"
          style={{
            overlay: { backgroundColor: "rgba(0,0,0,0.7)" },
            content: {
              maxWidth: "90%",
              maxHeight: "90%",
              margin: "auto",
              padding: 0,
              borderRadius: "8px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
        >
          <img
            src={modalImage}
            alt="Full"
            className="max-w-full max-h-full object-contain rounded"
          />
        </Modal>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3">
          <select
            className="border p-2 rounded w-full bg-white"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option value="">Select Material</option>
            <option value="wood">Wood</option>
            <option value="metal">Metal</option>
            <option value="glass">Glass</option>
            <option value="fabric">Fabric</option>
            <option value="leather">Leather</option>
          </select>

          <select
            className="border p-2 rounded w-full bg-white"
            value={furnitureType}
            onChange={(e) => setFurnitureType(e.target.value)}
          >
            <option value="">Select Furniture Type</option>
            <option value="chair">Chair</option>
            <option value="table">Table</option>
            <option value="sofa">Sofa</option>
            <option value="bed">Bed</option>
            <option value="stool">Stool</option>
            <option value="shelf">Shelf</option>
          </select>

          <button
            onClick={fetchData}
            className="px-8 py-2 rounded font-semibold text-sm sm:text-base"
            style={{ backgroundColor: color.primary, color: color.accent }}
          >
            Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceComparison;
