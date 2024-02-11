import { Message } from "discord.js";
import enqueue from "./queue/enque";
import { getPlaylist } from "../utils/youtube/videoService";
import { getPlaylistId, isSpotifyURL, isValidHttpUrl } from "../utils/youtube/urlUtils";
import path from "path";
import logger from "../loaders/logger";
import spotifyToYT from "../utils/spotify/trackService";

const addPlaylist = async (messageContent: string, message: Message) => {
  const playlist_url = messageContent;
  const guildId = message.guildId;

  logger.info("[SERVER ID] " + guildId);
  logger.info("[ACTION] addPlaylist");
  logger.info("[MESSAGE] " + playlist_url);
  let playlistId: string;

  if (isValidHttpUrl(playlist_url) && isSpotifyURL(playlist_url)) {
    const tracks = await spotifyToYT(playlist_url);

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

  try {
    playlistId = getPlaylistId(playlist_url);
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
          `/outputs/${guildId}/${video.videoId}`
        ),
      },
    })),
  });
};

export default addPlaylist;
