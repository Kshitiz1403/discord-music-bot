import path from "path";
import fs from "fs";
import {
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { bold, codeBlock } from "discord.js";
import youtubeDl from "youtube-dl-exec";
import { IVideoComponent } from "../interfaces/IQueueComponent";
import playerStatusEmitter from "../events/audioPlayer";
import deque from "./queue/deque";
import { formatDuration, truncate } from "../utils/botMessage/formatters";
import logger from "../loaders/logger";
import { PlayerEvents } from "../enums/events";
import forceStop from "./player/forceStop";

const play = async (videoComponent: IVideoComponent) => {
  const { message, options, youtube_url } = videoComponent;

  const voiceChannel = message.member.voice?.channelId;
  const guildId = message.member.guild.id;

  if (!voiceChannel) {
    message.channel.send(bold(codeBlock("⚠️ Please join a voice channel.")));
    forceStop(message);
    return;
  }

  const acknowledgementMessage = await message.channel.send(
    bold(codeBlock("Processing..."))
  );

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

  const status = await youtubeDl.exec(youtube_url, {
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    format: "bestaudio/best[height<=480]",
    output: outputPath,
  });

  const resource = createAudioResource(outputPath);

  player.play(resource);

  acknowledgementMessage.edit(
    bold(
      codeBlock(
        `🔊 Now Playing: ${truncate(options.title, 50)} ${formatDuration(
          options.duration
        )}`
      )
    )
  );

  connection.on(VoiceConnectionStatus.Disconnected, () => forceStop(message));

  playerStatusEmitter.on(
    PlayerEvents.FORCE_STOP,
    () =>
      connection.state.status != VoiceConnectionStatus.Destroyed &&
      connection.destroy()
  );

  playerStatusEmitter.on(PlayerEvents.PAUSE, () => player.pause());

  playerStatusEmitter.on(PlayerEvents.RESUME, () => player.unpause());

  playerStatusEmitter.on(PlayerEvents.STOP, () => player.stop());

  player.on("stateChange", (oldOne, newOne) => {
    if (newOne.status == AudioPlayerStatus.Idle) {
      // Song finished
      setTimeout(() => {
        logger.silly(`Deleting file ${outputPath}`);
        fs.unlink(outputPath, (err) => err && logger.error(`🔥 ${err}`));
      }, 2000);
      deque(message);
      return;
    }
  });
};

export default play;
