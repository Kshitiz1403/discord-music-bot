import { getVoiceConnection } from "@discordjs/voice";
import playerStatusEmitter from "../../events/audioPlayer";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import music_queue from "../../store/music_queue";
import play from "../player/play";
import { bold, codeBlock } from "discord.js";
import { isPlaylist, isVideo } from "../../interfaces/IQueueComponent";

const deque = (
  message: IQueueComponent["message"],
  dequeueCompletePlaylist = false
) => {
  const { guildId } = message;
  const mainQueue = music_queue.get(guildId);

  const nothingToPlay = () => {
    playerStatusEmitter.emit("stop");
    if (message.client.voice.adapters.size > 0) {
      message.channel.send(
        bold(codeBlock("No tracks to play."))
      );
      getVoiceConnection(message.guildId).disconnect();
    }
    return;
  };

  if (dequeueCompletePlaylist) {
    if (mainQueue.isEmpty()) return nothingToPlay();
    const firstInQueue = mainQueue.peek();
    if (!isPlaylist(firstInQueue))
      return message.channel.send(
        bold(
          codeBlock(
            `A song from playlist is not being played, hence not skipped. Use "skip" instead`
          )
        )
      );
    mainQueue.dequeue();
    if (mainQueue.isEmpty()) return nothingToPlay();

    const nextItem = mainQueue.peek();
    if (isVideo(nextItem)) return play(nextItem);

    const firstElement = nextItem.peek();
    if (isVideo(firstElement)) return play(firstElement);
    return;
  }

  //🥺Sorry for writing this code :(
  if (mainQueue.isEmpty()) return nothingToPlay();

  let typeOfItem = mainQueue.peek();
  if (isPlaylist(typeOfItem)) {
    const playlist = typeOfItem;
    playlist.dequeue();
    if (!playlist.isEmpty()) {
      const v = playlist.peek();
      if (isVideo(v)) return play(v);
    }
    mainQueue.dequeue();
    if (mainQueue.isEmpty()) return nothingToPlay();

    const peekedMainQueue = mainQueue.peek();
    if (isVideo(peekedMainQueue)) return play(peekedMainQueue);

    const innerPlaylist = peekedMainQueue;
    if (innerPlaylist.isEmpty()) return nothingToPlay();

    const peekInnerPlaylist = innerPlaylist.peek();
    if (isVideo(peekInnerPlaylist)) return play(peekInnerPlaylist);
    return;
  }
  mainQueue.dequeue();
  if (mainQueue.isEmpty()) return nothingToPlay();
  const next = mainQueue.peek();
  if (isVideo(next)) return play(next);

  const playlist = next;
  if (playlist.isEmpty()) return nothingToPlay();
  const playlistPeek = playlist.peek();
  if (isVideo(playlistPeek)) return play(playlistPeek);
};

export default deque;
