import { bold, codeBlock } from "discord.js";
import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import music_queue from "../../store/music_queue";
import { formatDuration, truncate } from "../../utils/botMessage/formatters";

const showPlaying = (message: IVideoMessageComponent["message"]) => {
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
  for (let it of iterator) {
    if (count == 0) {
      messageString += "🔊 Now Playing: \n";
    }
    messageString += `${truncate(it.options.title, 50)}  ${formatDuration(
      it.options.duration
    )}\n`;
    if (count == 0) {
      messageString += "\n";
      messageString += "🔊 Up Next: \n";
    }
    count++;
  }
  if (count == 1) {
    messageString += "No tracks here\n";
  }
  message.channel.send(bold(codeBlock(messageString)));
};

export default showPlaying;
