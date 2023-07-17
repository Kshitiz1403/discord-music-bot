import { Message } from "discord.js";

export interface IVideoMessageComponent {
  youtube_url: string;
  message: Message;
  options: { videoId: string; title?: string };
}
