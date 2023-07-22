import { Message, bold, codeBlock } from "discord.js";
import { deletePlayer, getPlayer } from "../../store/players";
import playerStatusEmitter from "../../events/audioPlayer";
import { PlayerEvents } from "../../enums/events";
import path from "path";
import fs from "fs";
import logger from "../../loaders/logger";

const leaveVC = (message: Message) => {
  const voiceChannelId = message.member.voice?.channelId;
  const guildId = message.guildId;
  if (!voiceChannelId) return;

  const player = getPlayer({ guildId, voiceChannelId });
  player.stop();
  playerStatusEmitter.emit(PlayerEvents.KILL, guildId);

  const guildFolder = path.join(global.appRoot, `./outputs/${guildId}`);
  logger.silly(`REMOVING FOLDER ${guildFolder}`);
  fs.rmdir(guildFolder, (err) =>
    logger.error(`ERROR REMOVING FOLDER ${guildFolder}`)
  );

  message.channel.send(
    bold(codeBlock("The BOT has been disconnected. Clearing the queue.🧹"))
  );

  deletePlayer({ guildId, voiceChannelId });
};

export default leaveVC;
