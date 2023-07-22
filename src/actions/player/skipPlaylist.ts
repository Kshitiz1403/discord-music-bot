import { PlayerEvents } from "../../enums/events";
import playerStatusEmitter from "../../events/audioPlayer";
import { IQueueComponent } from "../../interfaces/IQueueComponent";
import deque from "../queue/deque";

const skipPlaylist = (message: IQueueComponent["message"]) => {
  playerStatusEmitter.emit(PlayerEvents.SKIPLIST, message.guildId);
};

export default skipPlaylist;
