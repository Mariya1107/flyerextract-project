// config.js
const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-live-api-domain.com/api"  // live backend
    : "http://localhost:8000/";            // local backend

export default BASE_URL;
