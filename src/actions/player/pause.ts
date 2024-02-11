import { bold, codeBlock } from "discord.js";
import playerStatusEmitter from "../../events/audioPlayer";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import { PlayerEvents } from "../../enums/events";
import logger from "../../loaders/logger";

const pause = (message: IQueueComponent["message"]) => {
  const { guildId } = message;
  logger.info("[SERVER ID] " + guildId);
  logger.info("[ACTION] pause");

  const queue = music_queue.get(guildId);
  queue.pause();
  playerStatusEmitter.emit(PlayerEvents.PAUSE);
  message.channel.send(bold(codeBlock("⏸ Player paused")));
};

export default pause;
