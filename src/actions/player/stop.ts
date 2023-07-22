import fs from "fs-extra";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import logger from "../../loaders/logger";
import { deletePlayer, getPlayer } from "../../store/players";
import playerStatusEmitter from "../../events/audioPlayer";
import { PlayerEvents } from "../../enums/events";
import path from "path";
import { bold, codeBlock } from "discord.js";

const stop = (message: IQueueComponent["message"]) => {
  /**
   * Get Player
   * Stop Playback
   * Close Connection
   * Remove listeners
   * Clear Queue
   * Delete all files (better solution would be store files in folder i.e. guild id name)
   */

  const voiceChannelId = message.member.voice?.channelId;
  const guildId = message.member.guild.id;
  if (!voiceChannelId) return;

  const player = getPlayer({ guildId, voiceChannelId });
  if (!player) return;
  player.stop();
  playerStatusEmitter.emit(PlayerEvents.KILL, guildId);
  player.removeAllListeners();

  message.channel.send(
    bold(codeBlock("The BOT has been disconnected. Clearing the queue.🧹"))
  );

  deletePlayer({ guildId, voiceChannelId });
  music_queue.delete(guildId);

  setTimeout(() => {
    const guildFolder = path.join(global.appRoot, `./outputs/${guildId}`);
    logger.silly(`REMOVING FOLDER ${guildFolder}`);

    fs.remove(guildFolder, (err) =>
      logger.error(`ERROR REMOVING FOLDER ${err}`)
    );
  }, 10000);
};

export default stop;
