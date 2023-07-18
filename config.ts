import dotenv from "dotenv";
dotenv.config();

export default {
  node_env: process.env.NODE_ENV || "development",
  discord_bot_token: process.env.BOT_TOKEN,
  youtube_api_keys: [
    process.env.YOUTUBE_API_KEY_1,
    process.env.YOUTUBE_API_KEY_2,
  ],
};
