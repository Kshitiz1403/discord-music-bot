import { PlayerEvents } from "../../enums/events";
import playerStatusEmitter from "../../events/audioPlayer";
import { IQueueComponent } from "../../interfaces/IQueueComponent";

const skip = (message: IQueueComponent["message"]) => {
  playerStatusEmitter.emit(PlayerEvents.SKIP, message.guildId);
};

export default skip;
