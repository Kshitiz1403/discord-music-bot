import { IVideoSuggestion } from "../../../interfaces/IVideoSuggestion";
import { truncate, formatDuration } from "./../formatters";

const formatVideoSuggestions = (
  suggestion: IVideoSuggestion,
  index: number
) => {
  return `${index + 1}. ${truncate(suggestion.title, 50)}   ${formatDuration(
    suggestion.duration
  )}`;
};

export default formatVideoSuggestions;
