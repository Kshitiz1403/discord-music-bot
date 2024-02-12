import playdl, { Spotify, SpotifyPlaylist, SpotifyTrack } from "play-dl";
import { getVideo } from "../youtube/videoService";
import spotifyApi from "./spotifyAPI";
import { ITrack, TypeTrack } from "../../interfaces/spotify/ITrack";
import { IPlaylist, TypePlaylist } from "../../interfaces/spotify/IPlaylist";

const trackToYT = async (trackName: string): Promise<ITrack> => {
  const ytSearched = await playdl.search(trackName, { limit: 1 });
  const ytURL = ytSearched[0].url;
  const videoId = ytSearched[0].id;
  const videoInfo = await getVideo(videoId);

  return {
    youtube_url: ytURL,
    options: {
      videoId,
      title: videoInfo.title,
      duration: videoInfo.duration,
      description: videoInfo.description,
    },
  };
};

const playlistToYT = async (playlistID: string): Promise<IPlaylist> => {
  const tracks = (
    await spotifyApi.getPlaylistTracks(playlistID, {
      limit: 100,
      fields: "items",
    })
  ).body;

  const promises = [];
  tracks.items.map(({ track }) => promises.push(trackToYT(track.name)));

  const videos = await Promise.all(promises);

  return videos;
};

const spotifyToYT = async (spotifyURL: string) => {
  if (playdl.is_expired()) await playdl.refreshToken();

  const spotifyResponse = await playdl.spotify(spotifyURL);

  switch (spotifyResponse.type) {
    case "track": {
      const track = await trackToYT(spotifyResponse.name);
      return { type: "VIDEO", ...track } as TypeTrack;
    }
    case "playlist": {
      const playlist = await playlistToYT(spotifyResponse.id);

      return { type: "PLAYLIST", videos: playlist } as TypePlaylist;
    }
    default:
      throw new Error("Invalid Spotify type");
  }
};

export default spotifyToYT;
