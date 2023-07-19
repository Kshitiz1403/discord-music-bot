import { bold, codeBlock } from "discord.js";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import playerStatusEmitter from "../../events/audioPlayer";
import { PlayerEvents } from "../../enums/events";

const forceStop = (message: IQueueComponent["message"]) => {
  const { guildId } = message;
  playerStatusEmitter.emit(PlayerEvents.FORCE_STOP);
  message.channel.send(
    bold(codeBlock("The BOT has been disconnected. Clearing the queue.🧹"))
  );

  music_queue.delete(guildId);
};

export default forceStop;
