import dotenv from "dotenv";
dotenv.config();
import youtube_api_keys from "./src/loaders/apiLoader";

export default {
  node_env: process.env.NODE_ENV || "development",
  discord_bot_token: process.env.BOT_TOKEN,
  youtube_api_keys,
  spotify_client_id: process.env.SPOTIFY_CLIENT_ID,
  spotify_client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  spotify_redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
  spotify_access_token: process.env.SPOTIFY_ACCESS_TOKEN,
  spotify_refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
};
