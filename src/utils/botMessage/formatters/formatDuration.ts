import { IVideoComponent } from "../../../interfaces/IQueueComponent";
import * as durationFNS from "duration-fns";

function YTDurationToSeconds(duration: string) {
  const { hours, minutes, seconds } = durationFNS.parse(duration);

  return {
    hours,
    minutes,
    seconds,
    duration: hours * 3600 + minutes * 60 + seconds,
  };
}

const formatDuration = (duration: IVideoComponent["options"]["duration"]) => {
  const durationObj = YTDurationToSeconds(duration);

  const durationFormatted = `(${
    durationObj.hours > 0 ? durationObj.hours + ":" : ""
  }${
    durationObj.minutes > 9 ? durationObj.minutes : "0" + durationObj.minutes
  }:${
    durationObj.seconds > 9 ? durationObj.seconds : "0" + durationObj.seconds
  })`;
  return durationFormatted;
};

export default formatDuration;
