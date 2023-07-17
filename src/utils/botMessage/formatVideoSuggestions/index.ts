import { IVideoSuggestion } from "../../../interfaces/IVideoSuggestion";

const formatVideoSuggestions = (suggestion: IVideoSuggestion, index: number) => {
  function truncate(source: string, size: number) {
    return source.length > size ? source.slice(0, size - 1) + "…" : source;
  }

  return `${index + 1}. ${truncate(suggestion.title, 50)} 🎵 (${
    suggestion.duration.hours > 0 ? suggestion.duration.hours + ":" : ""
  }${
    suggestion.duration.minutes > 9
      ? suggestion.duration.minutes
      : "0" + suggestion.duration.minutes
  }:${
    suggestion.duration.seconds > 9
      ? suggestion.duration.seconds
      : "0" + suggestion.duration.seconds
  }) 🎵 ${suggestion.videoId}`;
};

export default formatVideoSuggestions;
