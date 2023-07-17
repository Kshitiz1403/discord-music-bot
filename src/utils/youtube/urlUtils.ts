export const getVideoURL = (videoId: string) => {
  return encodeURI(`https://www.youtube.com/watch?v=${videoId}`);
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

const isYTMusic = (url: string) => {
  url = url.replace("music.youtube.com", "youtube.com");

  let idx = url.indexOf("&list");
  if (idx != -1) {
    const sub = url.substring(0, idx);
    return sub;
  }
  return url;
};
export const getVideoIdFromURL = (url: string) => {
  url = isYTMusic(url);
  var regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return match && match[7].length == 11 ? match[7] : "";
};
