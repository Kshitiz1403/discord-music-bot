import { bold, codeBlock } from "discord.js";
import playerStatusEmitter from "../../events/audioPlayer";
import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import music_queue from "../../store/music_queue";

const pause = (message: IVideoMessageComponent["message"]) => {
  const { guildId } = message;
  const queue = music_queue.get(guildId);
  queue.pause();
  playerStatusEmitter.emit("pause");
  message.channel.send(bold(codeBlock("⏸ Player paused")));
};

export default pause;
