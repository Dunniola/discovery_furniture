"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
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
import Footer from "./Footer";

Modal.setAppElement("#root");

const PriceComparison = () => {
  const colors = {
    primary: "#030616",
    secondary: "#8d2726",
    accent: "#fcff53",
  };

  const BASE_URL = "https://api.damxstudio.com/api";

  const containerRef = useRef(null);

  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [materialIndexData, setMaterialIndexData] = useState([]);

  const [material, setMaterial] = useState("all");
  const [furnitureType, setFurnitureType] = useState("all");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value || 0);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      // bottom reached
    }
  }, []);

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;
    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const fetchMaterialIndex = async () => {
    try {
      const params = new URLSearchParams();
      if (country) params.append("country", country);
      if (stateProvince) params.append("state", stateProvince);

      const res = await axios.get(
        `${BASE_URL}/material-index?${params.toString()}`
      );
      setMaterialIndexData(res.data || []);
    } catch (err) {
      console.error("Material index fetch failed", err);
    }
  };

  const fetchPriceComparison = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (material !== "all") params.append("material", material);
      if (furnitureType !== "all") params.append("type", furnitureType);

      const res = await axios.get(
        `${BASE_URL}/moodboard-discover?${params.toString()}`
      );

      setData(
        Array.isArray(res?.data?.images)
          ? res.data.images.map((item) => ({
              id: item.id,
              title:
                item.title ||
                `${item.type || "Unknown"} (${item.material || "Unknown"})`,
              price: 0,
              type: item.type || "",
              material: item.material || "",
              website_url: item.website_url || "",
              lowResImage: item.low_res_image_url || null,
              fullImage: item.image_url || null,
            }))
          : []
      );
    } catch {
      setError("Failed to load comparison data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterialIndex();
    fetchPriceComparison();
  }, []);

  const applyFiltersMaterialIndex = () => {
    fetchMaterialIndex();
  };

  const applyFiltersPriceComparison = () => {
    fetchPriceComparison();
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white p-3 rounded shadow border">
          <p className="font-bold">{formatUSD(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const renderBarWithImage = ({ x, y, width, height, payload }) => {
    const imgSize = 36;
    const imgX = x + (width - imgSize) / 2;
    const imgY = y - imgSize - 14;

    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={colors.secondary} />
        {payload.lowResImage && (
          <image
            href={payload.lowResImage}
            x={imgX}
            y={imgY}
            width={imgSize}
            height={imgSize}
             clipPath="circle(50%)"
            preserveAspectRatio="xMidYMid slice"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setModalData(payload);
              setModalOpen(true);
            }}
          />
        )}
      </g>
    );
  };

  const copyImageUrl = () => {
    if (modalData?.fullImage) {
      navigator.clipboard.writeText(modalData.fullImage);
      alert("Image URL copied!");
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="w-full px-4 py-16 mt-20 overflow-auto"
        style={{ maxHeight: "calc(100vh - 80px)" }}
      >
        {/* ================= MATERIAL INDEX ================= */}
        <section className="mb-16 max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Material Index</h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={materialIndexData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="material" />
              <YAxis />
              <Tooltip formatter={(v) => formatUSD(v)} />
              <Bar dataKey="price" fill={colors.secondary} />
            </BarChart>
          </ResponsiveContainer>

          {/* Filters for Material Index */}
          <div className="flex flex-col md:flex-row items-end gap-4 mt-8">
            <div className="w-full">
              <span className="block mb-1 font-medium">Country:</span>
              <select
                className="border p-2 rounded bg-white w-full"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">All </option>
                <option value="Nigeria">Nigeria</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            <div className="w-full">
              <span className="block mb-1 font-medium">State:</span>
              <select
                className="border p-2 rounded bg-white w-full"
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
              >
                <option value="">All </option>
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Texas">Texas</option>
              </select>
            </div>

            <button
              onClick={applyFiltersMaterialIndex}
              className="py-2 px-10 rounded font-semibold text-white w-full md:w-fit"
              style={{ backgroundColor: colors.secondary, color: colors.accent }}
            >
              Update
            </button>
          </div>
        </section>

        {/* ================= PRICE COMPARISON ================= */}
        <section className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Price Comparison</h2>

          {loading ? (
            <p className="text-center py-12">Loading...</p>
          ) : error ? (
            <p className="text-red-600 text-center py-12">{error}</p>
          ) : (
            <ResponsiveContainer width="100%" height={420}>
              <BarChart data={data} margin={{ top: 120, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" angle={-35} interval={0} height={80} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="price" shape={renderBarWithImage} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Filters for Price Comparison */}
          <div className="flex flex-col md:flex-row gap-4 mt-8 items-end">
            <div className="w-full">
              <span className="block mb-1 font-medium">Material:</span>
              <select
                className="border p-2 rounded bg-white w-full"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
              >
                <option value="all">All</option>
                <option value="wood">Wood</option>
                <option value="metal">Metal</option>
                <option value="glass">Glass</option>
                <option value="leather">Leather</option>
                <option value="steel">Steel</option>
              </select>
            </div>

            <div className="w-full">
              <span className="block mb-1 font-medium">Furniture Type:</span>
              <select
                className="border p-2 rounded bg-white w-full"
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

            <button
              onClick={applyFiltersPriceComparison}
              className="py-2 px-10 rounded font-semibold text-white w-full md:w-fit "
              style={{ backgroundColor: colors.secondary, color: colors.accent }}
            >
              Update
            </button>
          </div>
        </section>

        <Footer />
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.85)", zIndex: 9999 },
          content: {
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "95%",
            maxWidth: "1000px",
            height: "90vh",
            padding: 0,
            borderRadius: "0",
            overflow: "hidden",
          },
        }}
      >
        {modalData && (
  <div className="flex flex-col md:flex-row h-full w-full max-md:w-screen">
    {/* IMAGE SECTION */}
   <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-0">
  {modalData.fullImage ? (
    <img
      src={modalData.fullImage}
      alt={modalData.title}
      className="w-full h-auto md:h-full object-contain  md:object-cover"
    />
  ) : (
    <p className="text-white">No Image</p>
  )}
</div>


    {/* CONTENT SECTION */}
    <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col h-full rounded-md">
      <div className="flex-1 overflow-y-auto space-y-3">
        <h2 className="text-xl md:text-2xl font-bold">
          {modalData.title}
        </h2>

        <p className="text-sm md:text-base">
          <strong>Price:</strong> {formatUSD(0)}
        </p>

        <p className="text-sm md:text-base">
          <strong>Material:</strong> {modalData.material}
        </p>

        <p className="text-sm md:text-base">
          <strong>Type:</strong> {modalData.type}
        </p>

        {/* VISIT WEBSITE */}
        {modalData.website_url && (
          <a
            href={modalData.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-red-900 font-semibold hover:underline mt-2"
          >
            Visit Website
          </a>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={copyImageUrl}
          className="border px-4 py-2 rounded w-full sm:w-auto"
        >
          Copy Image URL
        </button>

        <button
          onClick={() => setModalOpen(false)}
          className="px-4 py-2 rounded text-white w-full sm:w-auto"
          style={{ backgroundColor: colors.secondary }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

      </Modal>
    </>
  );
};

export default PriceComparison;
