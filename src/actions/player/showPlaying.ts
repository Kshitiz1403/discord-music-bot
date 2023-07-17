import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import music_queue from "../../store/music_queue";

const showPlaying = (message: IVideoMessageComponent["message"]) => {
  if (!music_queue.has(message.guildId))
    return message.channel.send("Nothing playing");

  const queue = music_queue.get(message.guildId);

  if (queue.isEmpty()) return message.channel.send("Nothing playing");

  const iterator = queue.iterator();

  let messageString = "Queue - \n";
  for (let it of iterator) {
    messageString += it.options.title + "\n";
  }
  message.channel.send(messageString);
};

export default showPlaying;
