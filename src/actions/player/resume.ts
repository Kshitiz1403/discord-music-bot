import { bold, codeBlock } from "discord.js";
import playerStatusEmitter from "../../events/audioPlayer";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import { PlayerEvents } from "../../enums/events";
import logger from "../../loaders/logger";

const resume = (message: IQueueComponent["message"]) => {
  const { guildId } = message;

  logger.info("[SERVER ID] " + guildId);
  logger.info("[ACTION] resume");

  const queue = music_queue.get(guildId);
  message.channel.send(bold(codeBlock("⏯ Player resumed")));
  queue.resume();
  playerStatusEmitter.emit(PlayerEvents.RESUME);
};

export default resume;
