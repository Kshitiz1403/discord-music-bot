import { IVideoMessageComponent } from "../../interfaces/IVideoMessageComponent";
import deque from "../queue/deque";

const skip = (message: IVideoMessageComponent["message"]) => deque(message);

export default skip;
