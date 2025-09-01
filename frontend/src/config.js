// config.js
let BASE_URL;

if (process.env.NODE_ENV === "production") {
  BASE_URL = "https://lookmydeals.com";   // 👈 live backend
} else {
  BASE_URL = "http://localhost:8000/";        // 👈 local backend
}

export default BASE_URL;
