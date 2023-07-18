import dotenv from "dotenv";
dotenv.config();

const youtube_api_keys = [];
const envs = process.env;
for (const key in envs) {
  if (key.startsWith("YOUTUBE_API_KEY_")) {
    youtube_api_keys.push(envs[key]);
  }
}

export default youtube_api_keys;
