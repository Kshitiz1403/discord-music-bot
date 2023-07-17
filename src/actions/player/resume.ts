import playerStatusEmitter from "../../events/audioPlayer";
import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import music_queue from "../../store/music_queue";

const resume = (message: IVideoMessageComponent["message"]) => {
  const { guildId } = message;
  const queue = music_queue.get(guildId);
  queue.resume();
  playerStatusEmitter.emit("resume");
  message.channel.send("Player resumed ⏯");
};

export default resume;
