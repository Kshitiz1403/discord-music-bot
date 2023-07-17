import dotenv from "dotenv";
dotenv.config();
export default {
    token: process.env.BOT_TOKEN,
    youtube_api_key: process.env.YOUTUBE_API_KEY
}