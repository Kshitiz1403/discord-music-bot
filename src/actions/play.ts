import { Message } from "discord.js";
import { getVideoIdFromURL, isValidHttpUrl } from "../utils/youtube/urlUtils";
import { getVideo, searchVideos } from "../utils/youtube/videoService";
import enqueue from "./queue/enque";
import path from "path";

const play = async (messagePayload: string, message: Message) => {
  try {
    const guildId = message.guildId;
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
    message.reply("An unexpected error occured.");
  }
};
export default play;
