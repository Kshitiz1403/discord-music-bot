import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
global.appRoot = path.resolve(__dirname, "..");
import config from "../config";
import {
  Client,
  CollectorFilter,
  Events,
  GatewayIntentBits,
  Message,
  MessageReaction,
  User,
  escapeSpoiler,
} from "discord.js";
import {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import youtubedl from "youtube-dl-exec";
import { EventEmitter } from "events";
import { IVideoMessageComponent } from "./interfaces/IVideoMessageComponent";
import { shouldBotTrigger, getMessagePayload } from "./utils/botMessage";
import { getVideo, searchVideos } from "./utils/youtube/videoService";
import {
  getVideoURL,
  getVideoIdFromURL,
  isValidHttpUrl,
} from "./utils/youtube/urlUtils";
import Queue from "./utils/Queue";
import COMMANDS from "./enums/commands";
import Levels from "./enums/levels";
import formatVideoSuggestion from "./utils/botMessage/formatVideoSuggestions";
import { loadYT_API_Key } from "./yt_api_service";

loadYT_API_Key();

const main = async () => {
  // GuildID -> VideoMessageComponent
  const music_queue = new Map<string, Queue>();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  await client.login(config.token);

  client.once(Events.ClientReady, (c) => {
    console.log(`Bot is online!`);

    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  /// Event emiiter for handling the audio player's pause and resume functionality.
  const playerStatusEmitter = new EventEmitter();

  const play = async (videoMessageComponent: IVideoMessageComponent) => {
    const { message, options, youtube_url } = videoMessageComponent;

    const voiceChannel = message.member.voice?.channelId;
    const guildId = message.member.guild.id;

    if (!voiceChannel) {
      message.channel.send("VC join karni padegi");
      return;
    }

    const connection = joinVoiceChannel({
      guildId: guildId.toString(),
      channelId: voiceChannel.toString(),
      adapterCreator: message.guild.voiceAdapterCreator,
      selfDeaf: true,
      selfMute: false,
    });

    getVoiceConnection(voiceChannel);

    const player = createAudioPlayer();
    const subscribe$ = connection.subscribe(player);

    const outputPath = path.join(
      global.appRoot,
      `./outputs/${options.videoId}.mp3`
    );

    const status = await youtubedl.exec(youtube_url, {
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
      format: "bestaudio/best[height<=480]",
      output: outputPath,
    });

    const resource = createAudioResource(outputPath);

    player.play(resource);

    playerStatusEmitter.on("pause", () => player.pause());

    playerStatusEmitter.on("resume", () => player.unpause());

    player.on("stateChange", (oldOne, newOne) => {
      if (newOne.status == AudioPlayerStatus.Idle) {
        // Song finished
        fs.unlink(outputPath, (err) => err && console.error(err));
        deque(message);
        return;
      }
    });
  };

  const skip = (message: IVideoMessageComponent["message"]) => deque(message);

  const pause = (message: IVideoMessageComponent["message"]) => {
    const { guildId } = message;
    const queue = music_queue.get(guildId);
    queue.pause();
    playerStatusEmitter.emit("pause");
    message.channel.send("Player paused ⏸");
  };

  const resume = (message: IVideoMessageComponent["message"]) => {
    const { guildId } = message;
    const queue = music_queue.get(guildId);
    queue.resume();
    playerStatusEmitter.emit("resume");
    message.channel.send("Player resumed ⏯");
  };

  const deque = (message: IVideoMessageComponent["message"]) => {
    const { guildId } = message;
    const queue = music_queue.get(guildId);

    queue.dequeue();

    if (queue.isEmpty() || !queue.isPlaying) return;

    const videoMessageComponent = queue.peek();
    play(videoMessageComponent);
  };

  const enqueue = (videoMessageComponent: IVideoMessageComponent) => {
    const { message, options, youtube_url } = videoMessageComponent;

    const { guildId } = message;

    if (!music_queue.has(guildId)) music_queue.set(guildId, new Queue());

    const queue = music_queue.get(guildId);
    const enquedSize = queue.size();

    queue.enqueue(videoMessageComponent);

    if (enquedSize == 0) {
      queue.resume();
      play(videoMessageComponent);
    }
  };

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

  const select = async (messagePayload: string, message: Message) => {
    if (isValidHttpUrl(messagePayload)) {
      const videoId = getVideoIdFromURL(messagePayload);
      const videoInfo = await getVideo(videoId);

      return enqueue({
        youtube_url: messagePayload,
        message,
        options: { videoId, title: videoInfo.title },
      });
    }

    const suggestions = await searchVideos(messagePayload);

    let formattedText = "";
    suggestions.map((suggestion, index) => {
      formattedText += `${formatVideoSuggestion(suggestion, index)}` + "\n";
    });

    if (!formattedText) return;

    const sentMessage = await message.reply(escapeSpoiler(formattedText));
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
      const content = collected.first().message.content.split("\n");
      let selectedIndex;

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
      const selectedContent = content[selectedIndex];

      const title = selectedContent.substring(
        selectedContent.indexOf(".") + 1,
        selectedContent.indexOf("🎵")
      );
      const splits = selectedContent.split("🎵 ");
      const videoId = splits[splits.length - 1];

      return enqueue({
        youtube_url: getVideoURL(videoId),
        message: message,
        options: { videoId, title },
      });
    } catch (error) {
      sentMessage.reply("An unexpected error occured.");
    } finally {
      sentMessage.reactions.removeAll();
    }
  };

  client.on("messageCreate", async (message) => {
    const content = message.content;
    if (!shouldBotTrigger(content)) return;

    const { message: messagePayload, command } = getMessagePayload(content);

    switch (command.toLowerCase()) {
      case COMMANDS.PLAY.toLowerCase():
        select(messagePayload, message);
        break;
      case COMMANDS.PAUSE.toLowerCase():
        pause(message);
        break;
      case COMMANDS.RESUME.toLowerCase():
        resume(message);
        break;
      case COMMANDS.SKIP.toLowerCase():
        skip(message);
        break;
      case COMMANDS.QUEUE.toLowerCase():
        showPlaying(message);
        break;
    }
  });
};

main();