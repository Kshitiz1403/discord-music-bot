import axios from "axios";
import { getVideoURL } from "./urlUtils";
import { IVideoSuggestion } from "../../interfaces/IVideoSuggestion";
import { getYT_API_Key, rotateKey, totalKeys } from "./yt_api_service";
import logger from "../../loaders/logger";

const retryableFunction = async (fn, n: number, ...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    if (n == 1) throw error;
    logger.debug("Retrying Function Call");
    const status = error?.response?.status;
    if (status == 403) {
      rotateKey();
    }
  }
  return await retryableFunction(fn, n - 1, args);
};

const getVideoHelper = async (videoId: string) => {
  const video = (
    await axios.get("https://youtube.googleapis.com/youtube/v3/videos", {
      params: {
        part: "contentDetails, snippet",
        id: videoId,
        key: getYT_API_Key(),
      },
    })
  ).data.items[0];

  return {
    duration: video.contentDetails.duration,
    title: video.snippet.title,
    description: video.snippet.description,
    channelTitle: video.snippet.channelTitle,
  };
};

const searchVideosHelper = async (search_term: string) => {
  const LIMIT = 5;
  const allVideos = await (
    await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
      params: {
        part: "snippet",
        maxResults: LIMIT,
        q: search_term,
        type: "video",
        key: getYT_API_Key(),
      },
    })
  ).data.items.slice(0, LIMIT);

  let videoInfoPromises = [];
  const videosRaw = allVideos.map((video) => {
    const { videoId } = video.id;
    const title = video.snippet.title;
    const url = getVideoURL(videoId);
    const videoInfo = getVideo(videoId);

    videoInfoPromises.push(videoInfo);

    return {
      videoId,
      title,
      url,
    };
  });

  let videoInfos = await Promise.all(videoInfoPromises);
  const videos: IVideoSuggestion[] = videosRaw.map((video, idx) => {
    const videoInfo = videoInfos[idx];

    let { duration } = videoInfo;

    return {
      videoId: video.videoId,
      duration,
      title: video.title,
      url: video.url,
    };
  });
  return videos;
};

export async function getVideo(
  videoId: string
): ReturnType<typeof getVideoHelper> {
  return retryableFunction(getVideoHelper, totalKeys(), videoId);
}

export async function searchVideos(
  search_term: string
): ReturnType<typeof searchVideosHelper> {
  return retryableFunction(searchVideosHelper, totalKeys(), search_term);
}
