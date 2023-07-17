import { EventEmitter } from "events";

// Event emiiter for handling the audio player's pause and resume functionality.
const playerStatusEmitter = new EventEmitter();

export default playerStatusEmitter;
