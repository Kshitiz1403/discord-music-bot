import { bold, codeBlock } from "discord.js";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import Queue from "../../utils/Queue";
import { formatDuration } from "../../utils/botMessage/formatters";
import splitStringToMessages from "../../utils/botMessage/formatters/splitStringToMessages";
import play from "../player/play";
import getOrCreatePlayer from "../player/join";

/**
 * Enqueues the song/ playlist into the queue and plays them if the queue is empty i.e. bot has not joined the VC.
 * @param queueComponent
 * @returns
 */
const enqueue = async (queueComponent: IQueueComponent) => {
  const { message } = queueComponent;
  const { guildId } = message;
  const voiceChannelId = message.member.voice?.channelId;

  if (!music_queue.has(guildId)) music_queue.set(guildId, new Queue());

  const queue = music_queue.get(guildId);
  const enquedSize = queue.size();

  /**  If there is no song in the queue, most likely there is no player (Ideally we are kicking out the player on emptied queue but still we might have missed something 🙂 ).*/

  if (enquedSize == 0 && !voiceChannelId)
    return message.channel.send(
      bold(codeBlock("⚠️ Please join a voice channel."))
    );

  queue.enqueue(queueComponent);

  if (queueComponent.type == "PLAYLIST") {
    const videos = queueComponent.videos;
    let acknowledgementMessage =
      "Playlist with thses videos added - (Restricted to 50)\n\n";
    videos.map((video, index) => {
      const singleMessage = `${index + 1}. ${
        video.options.title
      } ${formatDuration(video.options.duration)}\n`;

      acknowledgementMessage += singleMessage;
    });

    const MAX_LENGTH = 1900;

    const messages = splitStringToMessages(acknowledgementMessage, MAX_LENGTH);

    for (const msg of messages) {
      await message.channel.send(bold(codeBlock(msg)));
    }
  }

  // We don't want to display "added to queue" if there is no song in the queue. Rather we would want the player to start playing the song immediately.

  if (enquedSize == 0) {
    queue.resume();

    queueComponent.type == "VIDEO"
      ? // Plays the video
        play(queueComponent.video)
      : // Plays the first video of the playlist
        play(queueComponent.videos.find(Boolean));
    return;
  }

  if (queueComponent.type == "VIDEO")
    message.channel.send(
      bold(
        codeBlock(
          `${queueComponent.video.options.title} ${formatDuration(
            queueComponent.video.options.duration
          )} added to the queue.`
        )
      )
    );
};

export default enqueue;
