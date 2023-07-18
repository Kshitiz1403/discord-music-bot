import dotenv from "dotenv";
dotenv.config();
import youtube_api_keys from "./src/loaders/apiLoader";

export default {
  node_env: process.env.NODE_ENV || "development",
  discord_bot_token: process.env.BOT_TOKEN,
  youtube_api_keys,
};
