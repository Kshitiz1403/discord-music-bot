import path from "path";
import fs from "fs";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import { IVideoMessageComponent } from "../interfaces/IVideoMessageComponent";
import youtubeDl from "youtube-dl-exec";
import playerStatusEmitter from "../events/audioPlayer";
import deque from "./queue/deque";

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

export default play;
