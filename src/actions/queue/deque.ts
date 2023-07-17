import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import music_queue from "../../store/music_queue";
import play from "../play";

const deque = (message: IVideoMessageComponent["message"]) => {
  const { guildId } = message;
  const queue = music_queue.get(guildId);

  queue.dequeue();

  if (queue.isEmpty() || !queue.isPlaying) return;

  const videoMessageComponent = queue.peek();
  play(videoMessageComponent);
};

export default deque;
