import { Message } from "discord.js";
import Queue from "../utils/Queue";

export function isPlaylist(e: Queue | IVideoComponent): e is Queue {
  return (<Queue>e).type == "PLAYLIST";
}


export function isVideo(
  e: Queue | IVideoComponent
): e is IVideoComponent {
  return (<IVideoComponent>e).message !== undefined;
}

type IPlaylistWrapper = {
  message: IVideoComponent["message"];
  type: "PLAYLIST";
  videos: IVideoComponent[];
};

type IVideoWrapper = {
  message: IVideoComponent["message"];
  type: "VIDEO";
  video: IVideoComponent;
};

export type IQueueComponent = IPlaylistWrapper | IVideoWrapper;

export interface IVideoComponent {
  youtube_url: string;
  message: Message;
  options: {
    videoId: string;
    title: string;
    duration: string;
    description?: string;
    outputPath: string;
  };
}
