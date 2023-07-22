import fs from "fs";
import playerStatusEmitter from "../../events/audioPlayer";
import {
  IQueueComponent,
  IVideoComponent,
} from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import play from "../player/play";
import { Message, bold, codeBlock } from "discord.js";
import { isPlaylist, isVideo } from "../../utils/Queue";
import logger from "../../loaders/logger";
import stop from "../player/stop";
import { AudioPlayer } from "@discordjs/voice";

let count = 0;

const nothingToPlay = (message: Message) => {
  // playerStatusEmitter.emit("stop");
  if (message.client.voice.adapters.size > 0) {
    message.channel.send(bold(codeBlock("No tracks to play.")));
    stop(message);
  }
  return;
};

const dequeueOperation = (
  outputPath: IVideoComponent["options"]["outputPath"],
  player: AudioPlayer
) => {
  player.stop(true);
};

const deque = (
  message: IQueueComponent["message"],
  {
    dequeueCompletePlaylist = false,
    player,
  }: { dequeueCompletePlaylist?: boolean; player: AudioPlayer }
) => {
  const { guildId } = message;
  const mainQueue = music_queue.get(guildId);

  /**
   * Please forgive me this one last time, will never write this type of code again 😂
   */

  if (dequeueCompletePlaylist) {
    if (mainQueue.isEmpty()) return nothingToPlay(message);
    const firstInQueue = mainQueue.peek();
    if (!isPlaylist(firstInQueue))
      return message.channel.send(
        bold(
          codeBlock(
            `A song from playlist is not being played, hence not skipped. Use "skip" instead`
          )
        )
      );
    const dequeued = mainQueue.dequeue();
    if (isVideo(dequeued))
      dequeueOperation(dequeued.options.outputPath, player);
    if (mainQueue.isEmpty()) return nothingToPlay(message);

    const nextItem = mainQueue.peek();
    if (isVideo(nextItem)) return play(nextItem);

    const firstElement = nextItem.peek();
    if (isVideo(firstElement)) return play(firstElement);
    return;
  }

  /**
   * Okay now this is last 🙂
   */
  console.log(++count);
  if (mainQueue.isEmpty()) return nothingToPlay(message);

  let typeOfItem = mainQueue.peek();
  if (isPlaylist(typeOfItem)) {
    const playlist = typeOfItem;
    const dequeued = playlist.dequeue();
    if (isVideo(dequeued))
      dequeueOperation(dequeued.options.outputPath, player);
    if (!playlist.isEmpty()) {
      const v = playlist.peek();
      if (isVideo(v)) return play(v);
    }
    mainQueue.dequeue();
    if (mainQueue.isEmpty()) return nothingToPlay(message);

    const peekedMainQueue = mainQueue.peek();
    if (isVideo(peekedMainQueue)) return play(peekedMainQueue);

    const innerPlaylist = peekedMainQueue;
    if (innerPlaylist.isEmpty()) return nothingToPlay(message);

    const peekInnerPlaylist = innerPlaylist.peek();
    if (isVideo(peekInnerPlaylist)) return play(peekInnerPlaylist);
    return;
  }
  const video = mainQueue.dequeue();
  if (isVideo(video)) dequeueOperation(video.options.outputPath, player);
  if (mainQueue.isEmpty()) return nothingToPlay(message);
  const next = mainQueue.peek();
  if (isVideo(next)) return play(next);

  const playlist = next;
  if (playlist.isEmpty()) return nothingToPlay(message);
  const playlistPeek = playlist.peek();
  if (isVideo(playlistPeek)) return play(playlistPeek);
};

export default deque;
