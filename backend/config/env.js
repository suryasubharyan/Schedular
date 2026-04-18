import dotenv from "dotenv";

dotenv.config(); // 🔥 yahin load karo (top pe)

const ENV = process.env.ENV || "local";

console.log("ENV:", ENV);
console.log("MONGO_URI_LOCAL:", process.env.MONGO_URI_LOCAL);
console.log("MONGO_URI_PROD:", process.env.MONGO_URI_PROD);
console.log("FRONTEND_URL_LOCAL:", process.env.FRONTEND_URL_LOCAL);
const config = {
  mongoUri:
    ENV === "local"
      ? process.env.MONGO_URI_LOCAL
      : process.env.MONGO_URI_PROD,

  redirectUri:
    ENV === "local"
      ? process.env.REDIRECT_URI_LOCAL
      : process.env.REDIRECT_URI_PROD,

  frontendUrl:
    ENV === "local"
      ? process.env.FRONTEND_URL_LOCAL
      : process.env.FRONTEND_URL_PROD,
};

export default config;