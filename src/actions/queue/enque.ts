import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import music_queue from "../../store/music_queue";
import Queue from "../../utils/Queue";
import play from "../play";

const enqueue = (videoMessageComponent: IVideoMessageComponent) => {
  const { message, options, youtube_url } = videoMessageComponent;

  const { guildId } = message;

  if (!music_queue.has(guildId)) music_queue.set(guildId, new Queue());

  const queue = music_queue.get(guildId);
  const enquedSize = queue.size();

  queue.enqueue(videoMessageComponent);

  if (enquedSize == 0) {
    queue.resume();
    play(videoMessageComponent);
  }
};

export default enqueue;
