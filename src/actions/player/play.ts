import { createAudioResource } from "@discordjs/voice";
import { bold, codeBlock } from "discord.js";
import youtubeDl from "youtube-dl-exec";
import { IVideoComponent } from "../../interfaces/IQueueComponent";
import { formatDuration, truncate } from "../../utils/botMessage/formatters";
import getOrCreatePlayer from "./join";

const play = async (videoComponent: IVideoComponent) => {
  const { message, options, youtube_url } = videoComponent;
  const { outputPath, duration, title, videoId, description } = options;

  const player = await getOrCreatePlayer(message);

  const acknowledgementMessage = await message.channel.send(
    bold(codeBlock("Processing..."))
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
        `🔊 Now Playing: ${truncate(title, 50)} ${formatDuration(duration)}`
      )
    )
  );
};

export default play;
