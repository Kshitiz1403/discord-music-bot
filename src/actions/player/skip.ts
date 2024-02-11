import { IQueueComponent } from "../../interfaces/IQueueComponent";
import logger from "../../loaders/logger";
import deque from "../queue/deque";

const skip = (message: IQueueComponent["message"]) => {
  logger.info("[SERVER ID] " + message.guildId);
  logger.info("[ACTION] skip");
  deque(message);
};

export default skip;
