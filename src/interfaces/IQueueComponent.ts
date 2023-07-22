import { Message } from "discord.js";

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
