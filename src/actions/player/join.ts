import { Message, bold, codeBlock } from "discord.js";
import {
  AudioPlayer,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  createAudioPlayer,
  getVoiceConnection,
  joinVoiceChannel,
} from "@discordjs/voice";
import playerStatusEmitter from "../../events/audioPlayer";
import { PlayerEvents } from "../../enums/events";
import { getPlayer, hasPlayer, setPlayer } from "../../store/players";
import stop from "./stop";
import deque from "../queue/deque";

const getOrCreatePlayer = async (message: Message): Promise<AudioPlayer> => {
  const voiceChannelId = message.member.voice?.channelId;
  const guildId = message.member.guild.id;

  if (!voiceChannelId) {
    await message.channel.send(
      bold(codeBlock("⚠️ Please join a voice channel."))
    );
    // stop(message);
    return;
  }

  if (hasPlayer({ guildId, voiceChannelId })) {
    return getPlayer({ guildId, voiceChannelId });
  }
  const connection = joinVoiceChannel({
    guildId: guildId.toString(),
    channelId: voiceChannelId.toString(),
    adapterCreator: message.guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: false,
  });

  getVoiceConnection(voiceChannelId);

  const player = createAudioPlayer({});
  setPlayer({ guildId, voiceChannelId }, player);

  const subscribe$ = connection.subscribe(player);

  const stopTrigger = () => stop(message);

  connection.on(VoiceConnectionStatus.Disconnected, stopTrigger);

  const kill = (guildIdToKillConnection) => {
    if (guildIdToKillConnection == guildId) {
      connection.state.status != VoiceConnectionStatus.Destroyed &&
        connection.destroy();
      subscribe$.unsubscribe();
    }
  };

  playerStatusEmitter.on(PlayerEvents.KILL, kill);

  // playerStatusEmitter.on(PlayerEvents.PAUSE, (guildIdToPause) =>
  //   guildIdToPause == guildId ? player.pause() : null
  // );

  // playerStatusEmitter.on(PlayerEvents.RESUME, (guildIdToResume) =>
  //   guildIdToResume == guildId ? player.unpause() : null
  // );

  function stateChange(oldState, newState) {
    // Song finished

    if (newState.status == AudioPlayerStatus.Idle) {
      return deque(message, { player });
    }
  }

  /**
   * @todo Not a neat solution, but working on a better solution
   */
  function reattachListener() {
    setTimeout(() => {
      player.on("stateChange", stateChange);
    }, 50);
  }

  /**
   * @todo Not a neat solution, but working on a better solution
   */

  function skip(guildIdToStop) {
    if (guildIdToStop == guildId) {
      player.removeListener("stateChange", stateChange);
      deque(message, { player });
      reattachListener();
    }
  }

  /**
   * @todo Not a neat solution, but working on a better solution
   */
  function skipList(guildIdToStop) {
    if (guildIdToStop == guildId) {
      player.removeListener("stateChange", stateChange);
      deque(message, { dequeueCompletePlaylist: true, player });
      reattachListener();
    }
  }

  playerStatusEmitter.on(PlayerEvents.SKIP, skip);

  playerStatusEmitter.on(PlayerEvents.SKIPLIST, skipList);

  player.on("stateChange", stateChange);

  return player;
};

export default getOrCreatePlayer;
