import {
  CollectorFilter,
  Message,
  MessageReaction,
  User,
  bold,
  codeBlock,
  escapeSpoiler,
} from "discord.js";
import Levels from "../enums/levels";
import {
  getVideoIdFromURL,
  getVideoURL,
  isValidHttpUrl,
} from "../utils/youtube/urlUtils";
import { getVideo, searchVideos } from "../utils/youtube/videoService";
import formatVideoSuggestions from "../utils/botMessage/formatters/formatVideoSuggestions";
import enqueue from "./queue/enque";
import selections from "../store/selections";

const select = async (messagePayload: string, message: Message) => {
  if (isValidHttpUrl(messagePayload)) {
    const videoId = getVideoIdFromURL(messagePayload);
    const videoInfo = await getVideo(videoId);

    return enqueue({
      youtube_url: messagePayload,
      message,
      options: {
        videoId,
        title: videoInfo.title,
        duration: videoInfo.duration,
        description: videoInfo.description,
      },
    });
  }

  const suggestions = await searchVideos(messagePayload);

  let formattedText = "🤔Selections\n\n";
  suggestions.map((suggestion, index) => {
    formattedText += `${formatVideoSuggestions(suggestion, index)}` + "\n";
  });

  if (!formattedText) return;

  const sentMessage = await message.reply(
    bold(codeBlock(escapeSpoiler(formattedText)))
  );

  selections.set(sentMessage.id, suggestions);

  await Promise.all([
    sentMessage.react(Levels.ONE),
    sentMessage.react(Levels.TWO),
    sentMessage.react(Levels.THREE),
    sentMessage.react(Levels.FOUR),
    sentMessage.react(Levels.FIVE),
    sentMessage.react(Levels.EASTER_EGG),
  ]);

  const collectorFilter: CollectorFilter<[MessageReaction, User]> = (
    reaction,
    user
  ) =>
    // compares user reacting to original message sent by user with the reaction
    user.id == message.author.id &&
    (reaction.emoji.name == Levels.ONE ||
      reaction.emoji.name == Levels.TWO ||
      reaction.emoji.name == Levels.THREE ||
      reaction.emoji.name == Levels.FOUR ||
      reaction.emoji.name == Levels.FIVE ||
      reaction.emoji.name == Levels.EASTER_EGG);

  try {
    const collected = await sentMessage.awaitReactions({
      filter: collectorFilter,
      max: 1,
      errors: ["time"],
      maxEmojis: 1,
      maxUsers: 1,
    });

    let selectedIndex: number;

    switch (collected.first().emoji.name) {
      case Levels.ONE:
        selectedIndex = 0;
        break;
      case Levels.TWO:
        selectedIndex = 1;
        break;
      case Levels.THREE:
        selectedIndex = 2;
        break;
      case Levels.FOUR:
        selectedIndex = 3;
        break;
      case Levels.FIVE:
        selectedIndex = 4;
        break;
      case Levels.EASTER_EGG:
        break;
      default:
        sentMessage.reply("Error");
    }

    const all_options = selections.get(sentMessage.id);
    const selected_option = all_options[selectedIndex];

    return enqueue({
      youtube_url: selected_option.url,
      message: message,
      options: {
        videoId: selected_option.videoId,
        title: selected_option.title,
        duration: selected_option.duration,
      },
    });
  } catch (error) {
    sentMessage.reply("An unexpected error occured.");
  } finally {
    sentMessage.reactions.removeAll();
  }
};

export default select;
