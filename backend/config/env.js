import dotenv from "dotenv";

dotenv.config(); // 🔥 yahin load karo (top pe)

const ENV = process.env.ENV || "local";

console.log(`ENV: ${ENV}`);

const config = {
  mongoUri:
    ENV === "local"
      ? process.env.MONGO_URI_LOCAL
      : process.env.MONGO_URI_PROD,
  backendUrl:
    ENV === "local"
      ? process.env.BACKEND_URL_LOCAL || `http://localhost:${process.env.PORT || 5000}`
      : process.env.BACKEND_URL_PROD || `http://localhost:${process.env.PORT || 5000}`,

  frontendUrl:
    ENV === "local"
      ? process.env.FRONTEND_URL_LOCAL
      : process.env.FRONTEND_URL_PROD,
};

export default config;
