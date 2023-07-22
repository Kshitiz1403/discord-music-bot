import { bold, codeBlock } from "discord.js";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import Queue from "../../utils/Queue";
import { formatDuration } from "../../utils/botMessage/formatters";
import play from "../play";
import splitStringToMessages from "../../utils/botMessage/formatters/splitStringToMessages";

const enqueue = async (queueComponent: IQueueComponent) => {
  const { message } = queueComponent;
  const { guildId } = message;

  if (!music_queue.has(guildId)) music_queue.set(guildId, new Queue("VIDEO"));

  const queue = music_queue.get(guildId);
  const enquedSize = queue.size();

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

  if (enquedSize == 0) {
    queue.resume();

    queueComponent.type == "VIDEO"
      ? // Plays the video
        play(queueComponent.video)
      : // Plays the first video of the playlist
        play(queueComponent.videos.find(Boolean));
  } else {
    switch (queueComponent.type) {
      case "VIDEO":
        message.channel.send(
          bold(
            codeBlock(
              `${queueComponent.video.options.title} ${formatDuration(
                queueComponent.video.options.duration
              )} added to the queue.`
            )
          )
        );
        break;
    }
  }
};

export default enqueue;
