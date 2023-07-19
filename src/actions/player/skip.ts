import { IQueueComponent } from "../../interfaces/IQueueComponent";
import deque from "../queue/deque";

const skip = (message: IQueueComponent["message"]) => deque(message);

export default skip;
