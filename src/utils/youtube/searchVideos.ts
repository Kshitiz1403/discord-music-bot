import axios from "axios";
import config from "../../../config";
import { getVideoURL } from "./urlUtils";
import { IVideoSuggestion } from "../../interfaces/IVideoSuggestion";

function YTDurationToSeconds(duration: string) {
  let match: any = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

  match = match.slice(1).map(function (x: string) {
    if (x != null) {
      return x.replace(/\D/, "");
    }
  });

  let hours = parseInt(match[0]) || 0;
  let minutes = parseInt(match[1]) || 0;
  let seconds = parseInt(match[2]) || 0;

  return {
    hours,
    minutes,
    seconds,
    duration: hours * 3600 + minutes * 60 + seconds,
  };
}

const getVideo = async (videoId) => {
  return await axios.get("https://youtube.googleapis.com/youtube/v3/videos", {
    params: {
      part: "contentDetails",
      id: videoId,
      key: config.youtube_api_key,
    },
  });
};
const searchVideos = async (search_term: string) => {
  const allVideos = await (
    await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        maxResults: 5,
        q: search_term,
        type: "video",
        key: config.youtube_api_key,
      },
    })
  ).data.items;

  const promises = allVideos.map(async (video: any) => {
    const { videoId } = video.id;
    const title = video.snippet.title;
    const url = getVideoURL(videoId);
    const duration = (
      await axios.get("https://youtube.googleapis.com/youtube/v3/videos", {
        params: {
          part: "contentDetails",
          id: videoId,
          key: config.youtube_api_key,
        },
      })
    ).data.items[0].contentDetails.duration;

    const obj = {
      videoId,
      title,
      url,
      duration,
    };
    return obj;
  });
  const videosRaw = await Promise.all(promises);

  const videos: IVideoSuggestion[] = videosRaw.map((video) => ({
    ...video,
    duration: YTDurationToSeconds(video.duration),
  }));
  return videos;
};

export default searchVideos;
