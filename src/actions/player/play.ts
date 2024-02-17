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
import { IVideoComponent } from "../../interfaces/IQueueComponent";
import playerStatusEmitter from "../../events/audioPlayer";
import deque from "../queue/deque";
import { formatDuration, truncate } from "../../utils/botMessage/formatters";
import logger from "../../loaders/logger";
import { PlayerEvents } from "../../enums/events";
import forceStop from "./forceStop";
import { YTDurationToSeconds } from "../../utils/botMessage/formatters/formatDuration";
import IntervalTimer from "../../utils/intervalTimer";
import elapsedDuration from "../../utils/botMessage/formatters/elapsedDuration";

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

  const status = await youtubeDl.exec(youtube_url, {
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    format: "bestaudio/best[height<=480]",
    output: videoComponent.options.outputPath,
  });

  const resource = createAudioResource(videoComponent.options.outputPath);

  player.play(resource);

  const duration = YTDurationToSeconds(videoComponent.options.duration);

  const nowPlayingMsg = `🔊 Now Playing: ${truncate(
    options.title,
    50
  )} ${formatDuration(options.duration)}`;

  const interval = IntervalTimer(() => {
    acknowledgementMessage.edit(
      bold(
        codeBlock(
          `${nowPlayingMsg} \n ${elapsedDuration(
            resource.playbackDuration / 1000,
            duration.duration
          )}`
        )
      )
    );
  }, 2000);

  //  connection.on(VoiceConnectionStatus.Disconnected, () => forceStop(message));

  playerStatusEmitter.on(PlayerEvents.FORCE_STOP, () => {
    connection.state.status != VoiceConnectionStatus.Destroyed &&
      connection.destroy();
    interval.pause();
  });

  playerStatusEmitter.on(PlayerEvents.PAUSE, () => {
    player.pause();
    interval.pause();
  });

  playerStatusEmitter.on(PlayerEvents.RESUME, () => {
    player.unpause();
    interval.resume();
  });

  playerStatusEmitter.on(PlayerEvents.STOP, () => {
    player.stop();
    interval.pause();
  });

  player.on("stateChange", (oldOne, newOne) => {
    if (newOne.status == AudioPlayerStatus.Idle) {
      // Song finished
      deque(message);

      interval.pause();
      return;
    }
  });
};

export default play;
