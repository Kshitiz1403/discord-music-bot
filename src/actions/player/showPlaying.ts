import { bold, codeBlock } from "discord.js";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import { formatDuration, truncate } from "../../utils/botMessage/formatters";
import { isPlaylist, isVideo } from "../../interfaces/IQueueComponent";
import splitStringToMessages from "../../utils/botMessage/formatters/splitStringToMessages";

const showPlaying = (message: IQueueComponent["message"]) => {
  if (
    !music_queue.has(message.guildId) ||
    music_queue.get(message.guildId).isEmpty()
  )
    return message.channel.send(
      bold(codeBlock("Queue\n\n🔊 Now Playing:\nNo track  (00:00)"))
    );

  const queue = music_queue.get(message.guildId);

  const iterator = queue.iterator();

  let count = 0;

  let messageString = "Queue\n\n";

  /**
   * Two cases -> Playing inside a playlist, playing as a video
   */
  for (let it of iterator) {
    const unitSongMessage = (title, duration) => {
      messageString += `(Playlist) ${truncate(title, 50)}  ${formatDuration(
        duration
      )}\n`;
      if (count == 0) {
        messageString += "\n";
        messageString += "🔊 Up Next: \n";
      }
      count++;
    };


    if (count == 0) {
      messageString += "🔊 Now Playing: \n";
    }

    if (isPlaylist(it)) {
      const playlistIterator = it.iterator();
      for (const pt of playlistIterator) {
        if (!isVideo(pt)) continue;
        unitSongMessage(pt.options.title, pt.options.duration);
      }
    } else {
      unitSongMessage(it.options.title, it.options.duration);
    }

    if (count == 0) {
      messageString += "\n";
      messageString += "🔊 Up Next: \n";
    }
    count++;
  }
  if (count == 1) {
    messageString += "No tracks here\n";
  }

  let shortMessage: string = splitStringToMessages(messageString, 1000)[0];
  if (messageString.length > shortMessage.length) {
    shortMessage += ".\n";
    shortMessage += ".\n";
    shortMessage += ".\n";
  }
  message.channel.send(bold(codeBlock(shortMessage)));
};

export default showPlaying;
