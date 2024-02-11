import { Message } from "discord.js";
import { getVideoIdFromURL, isSpotifyURL, isValidHttpUrl } from "../utils/youtube/urlUtils";
import { getVideo, searchVideos } from "../utils/youtube/videoService";
import enqueue from "./queue/enque";
import path from "path";
import logger from "../loaders/logger";
import spotifyToYT from "../utils/spotify/trackService";

const play = async (messagePayload: string, message: Message) => {
  try {
    logger.info("[SERVER ID] " + message.guildId);
    logger.info("[ACTION] play");
    logger.info("[MESSAGE] " + messagePayload);
    const guildId = message.guildId;

    if (
      isValidHttpUrl(messagePayload) &&
      isSpotifyURL(messagePayload)
    ) {
      const tracks = await spotifyToYT(messagePayload);

      switch (tracks.type) {
        case "VIDEO": {
          return enqueue({
            message,
            type: "VIDEO",
            video: {
              youtube_url: tracks.youtube_url,
              message,
              options: {
                videoId: tracks.options.videoId,
                title: tracks.options.title,
                duration: tracks.options.duration,
                outputPath: path.join(
                  global.appRoot,
                  `/outputs/${guildId}/${tracks.options.videoId}`
                ),
              },
            },
          });
        }
        case "PLAYLIST": {
          return enqueue({
            message,
            type: "PLAYLIST",
            videos: tracks.videos.map((video) => ({
              youtube_url: video.youtube_url,
              message,
              options: {
                videoId: video.options.videoId,
                duration: video.options.duration,
                title: video.options.title,
                description: video.options.description,
                outputPath: path.join(
                  global.appRoot,
                  `/outputs/${guildId}/${video.options.videoId}`
                ),
              },
            })),
          });
        }
      }
    }

    if (isValidHttpUrl(messagePayload)) {
      const videoId = getVideoIdFromURL(messagePayload);
      const videoInfo = await getVideo(videoId);

      return enqueue({
        message,
        type: "VIDEO",
        video: {
          youtube_url: messagePayload,
          message,
          options: {
            videoId,
            title: videoInfo.title,
            duration: videoInfo.duration,
            description: videoInfo.description,
            outputPath: path.join(
              global.appRoot,
              `/outputs/${guildId}/${videoId}`
            ),
          },
        },
      });
    }

    const suggestion = (await searchVideos(messagePayload, { LIMIT: 1 }))[0];
    return enqueue({
      message,
      type: "VIDEO",
      video: {
        youtube_url: suggestion.url,
        message,
        options: {
          videoId: suggestion.videoId,
          title: suggestion.title,
          duration: suggestion.duration,
          outputPath: path.join(
            global.appRoot,
            `/outputs/${guildId}/${suggestion.videoId}`
          ),
        },
      },
    });
  } catch (error) {
    console.error(error);
    logger.error("[ERROR] " + error);
    message.reply("An unexpected error occured.");
  }
};
export default play;
