import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PriceComparison = () => {
  const colors = ["#030616", "#8d2726", "#fcff53", "#00aaff", "#ff66cc"]; // added extra colors
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BASE_URL = "https://api.damxstudio.com/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/price-comparison`);

        if (res.data && Array.isArray(res.data.data)) {
          const rawData = res.data.data;

          // Collect all unique furniture_type + material combinations
          const allKeysSet = new Set();
          rawData.forEach(({ furniture_type, material }) => {
            allKeysSet.add(`${furniture_type} (${material})`);
          });
          const allKeys = Array.from(allKeysSet);

          // Group by designer
          const grouped = {};
          rawData.forEach(({ designer, furniture_type, material, price }) => {
            if (!grouped[designer]) grouped[designer] = { designer };
            const key = `${furniture_type} (${material})`;
            grouped[designer][key] = price;
          });

          // Fill missing keys with 0 for each designer
          const normalizedData = Object.values(grouped).map((designerObj) => {
            allKeys.forEach((key) => {
              if (!(key in designerObj)) designerObj[key] = 0;
            });
            return designerObj;
          });

          setData(normalizedData);
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

    fetchData();
  }, []);

  if (loading)
    return <p className="p-4 text-center" style={{ color: colors[0] }}>Loading price comparison...</p>;

  if (error)
    return <p className="p-4 text-center" style={{ color: colors[1] }}>{error}</p>;

  // Collect all keys again from normalized data
  const allKeys = data.length > 0 ? Object.keys(data[0]).filter((k) => k !== "designer") : [];

  return (
    <div className="p-4 sm:p-6 mt-20">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left" style={{ color: colors[0] }}>
        Price Comparison
      </h2>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 10, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="designer"
            interval={0}
            angle={-35}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip wrapperStyle={{ fontSize: "12px" }} />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          {allKeys.map((key, i) => (
            <Bar
              key={i}
              dataKey={key}
              fill={colors[i % colors.length]} // cycle through colors
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceComparison;
