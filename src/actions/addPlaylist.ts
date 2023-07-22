import { Message } from "discord.js";
import path from "path";
import enqueue from "./queue/enque";
import { getPlaylist } from "../utils/youtube/videoService";
import { getPlaylistId } from "../utils/youtube/urlUtils";

const addPlaylist = async (messageContent: string, message: Message) => {
  const youtube_url = messageContent;
  const guildId = message.guildId;

  let playlistId: string;
  try {
    playlistId = getPlaylistId(youtube_url);
  } catch (error) {
    return message.channel.send("Badly formatted URL.");
  }
  const videos = await getPlaylist(playlistId);

  enqueue({
    message,
    type: "PLAYLIST",
    videos: videos.items.map((video) => ({
      youtube_url: video.youtube_url,
      message,
      options: {
        videoId: video.videoId,
        duration: video.duration,
        title: video.title,
        description: video.description,
        outputPath: path.join(
          global.appRoot,
          `./outputs/${guildId}/${video.videoId}.mp3`
        ),
      },
    })),
  });
};

export default addPlaylist;
