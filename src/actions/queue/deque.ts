import playerStatusEmitter from "../../events/audioPlayer";
import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import music_queue from "../../store/music_queue";
import play from "../play";

const deque = (message: IVideoMessageComponent["message"]) => {
  const { guildId } = message;
  const queue = music_queue.get(guildId);

  if (queue.isEmpty()) return;
  queue.dequeue();

  if (queue.isEmpty()) {
    // when called from "skip", the queue if "now empty", must explicitly ask the player to stop.
    playerStatusEmitter.emit("stop");
    return;
  }
  if (!queue.isPlaying) return;

  const videoMessageComponent = queue.peek();
  play(videoMessageComponent);
};

export default deque;
