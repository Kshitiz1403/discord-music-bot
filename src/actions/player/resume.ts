import { bold, codeBlock } from "discord.js";
import playerStatusEmitter from "../../events/audioPlayer";
import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import music_queue from "../../store/music_queue";

const resume = (message: IVideoMessageComponent["message"]) => {
  const { guildId } = message;
  const queue = music_queue.get(guildId);
  message.channel.send(bold(codeBlock("⏯ Player resumed")));
  queue.resume();
  playerStatusEmitter.emit("resume");
};

export default resume;
