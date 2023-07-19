import { getVoiceConnection } from "@discordjs/voice";
import playerStatusEmitter from "../../events/audioPlayer";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import play from "../play";
import { bold, codeBlock } from "discord.js";
import { PlayerEvents } from "../../enums/events";
import Queue, { isPlaylist, isVideo } from "../../utils/Queue";

const dequeueCore = (
  queue: Queue,
  mainQueue: Queue,
  message: IQueueComponent["message"]
) => {
  if (queue.isEmpty()) return;

  queue.dequeue();
  if (isPlaylist(queue) && queue.isEmpty()) mainQueue.dequeue();

  if (mainQueue.isEmpty()) {
    // when called from "skip", the queue if "now empty", must explicitly ask the player to stop.
    playerStatusEmitter.emit(PlayerEvents.STOP);
    if (message.client.voice.adapters.size > 0) {
      message.channel.send(
        bold(codeBlock("No tracks to play, leaving the VC..."))
      );
      getVoiceConnection(message.guildId).disconnect();
    }
    return;
  }
  if (!mainQueue.isPlaying()) return;

  const peek = queue.peek();

  // Unnecessary check for the typescript compiler.
  if (isVideo(peek)) play(peek);
};

const deque = (
  message: IQueueComponent["message"],
  dequeueCompletePlaylist = false
) => {
  const { guildId } = message;
  const mainQueue = music_queue.get(guildId);

  if (mainQueue.isEmpty()) return;

  // Check if the peek element is a playlist or not, if not, go ahead, else check-in into the playlist, then proceed.

  const playlist = mainQueue.peek();

  if (dequeueCompletePlaylist && !isPlaylist(playlist))
    return message.channel.send(
      bold(
        codeBlock(
          `A song from playlist is not being played, hence not skipped. Use "skip" instead`
        )
      )
    );

  if (dequeueCompletePlaylist && isPlaylist(playlist)) {
    return dequeueCore(mainQueue, mainQueue, message);
  }

  //Two cases

  // if current song is part a playlist
  if (isPlaylist(playlist)) {
    // check-in into the playlist,
    return dequeueCore(playlist, mainQueue, message);
  }

  // If current song is not part of playlist

  dequeueCore(mainQueue, mainQueue, message);
};

export default deque;
