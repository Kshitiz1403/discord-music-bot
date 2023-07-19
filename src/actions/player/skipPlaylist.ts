import { IQueueComponent } from "../../interfaces/IQueueComponent";
import deque from "../queue/deque";

const skipPlaylist = (message: IQueueComponent["message"]) =>
  deque(message, true);

export default skipPlaylist;
