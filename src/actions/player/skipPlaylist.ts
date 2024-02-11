import { IQueueComponent } from "../../interfaces/IQueueComponent";
import logger from "../../loaders/logger";
import deque from "../queue/deque";

const skipPlaylist = (message: IQueueComponent["message"]) => {
  logger.info("[SERVER ID] " + message.guildId);
  logger.info("[ACTION] skipPlaylist");

  deque(message, true);
};

export default skipPlaylist;
