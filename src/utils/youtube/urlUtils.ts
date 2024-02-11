export const getVideoURL = (videoId: string) => {
  return encodeURI(`https://www.youtube.com/watch?v=${videoId}`);
};

export const getPlaylistId = (youtube_url: string) => {
  const regex = /[&?]list=([^&]+)/i;

  const match = youtube_url.match(regex);
  const playlistId = match[1];
  return playlistId;
};

export const isValidHttpUrl = (string: string) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};

export const isSpotifyURL = (url: string) => {
  // TODO: THIS NEEDS TO BE MATCHED USING REGEX
  return url.includes("spotify.com");
};

const isYTMusic = (url: string) => {
  url = url.replace("music.youtube.com", "youtube.com");

  const listIndex = url.indexOf("&list");
  if (listIndex != -1) {
    const everythingBeforeList = url.substring(0, listIndex);
    return everythingBeforeList;
  }
  return url;
};

// https://stackoverflow.com/questions/3452546/how-do-i-get-the-youtube-video-id-from-a-url
export const getVideoIdFromURL = (url: string) => {
  url = isYTMusic(url);
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : "";
};
