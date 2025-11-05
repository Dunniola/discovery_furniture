// src/utils/api.js
const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api"
    : "https://damxstudio.com/api";

export default BASE_URL;
