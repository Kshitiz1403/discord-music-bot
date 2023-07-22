import { bold, codeBlock } from "discord.js";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import { getPlayer } from "../../store/players";

const resume = (message: IQueueComponent["message"]) => {
  const { guildId } = message;
  const voiceChannelId = message.member.voice?.channelId;

  if (!voiceChannelId)
    return message.channel.send(
      bold(codeBlock("Nah, you need to join the VC to do that."))
    );

  const player = getPlayer({ guildId, voiceChannelId });
  if (!player) return;
  player.unpause();

  const queue = music_queue.get(guildId);
  queue.resume();
  message.channel.send(bold(codeBlock("⏯ Player resumed")));
};

export default resume;
