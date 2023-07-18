import { IVideoMessageComponent } from "../../../interfaces/IVideoMessageComponent";

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

const formatDuration = (
  duration: IVideoMessageComponent["options"]["duration"]
) => {
  const durationObj = YTDurationToSeconds(duration);

  const durationFormatted = `(${
    durationObj.hours > 0 ? durationObj.hours + ":" : ""
  }${
    durationObj.minutes > 9 ? durationObj.minutes : "0" + durationObj.minutes
  }:${
    durationObj.seconds > 9 ? durationObj.seconds : "0" + durationObj.seconds
  })`;
  return durationFormatted
};

export default formatDuration;
