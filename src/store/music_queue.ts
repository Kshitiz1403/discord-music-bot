import Queue from "../utils/Queue";

// GuildID -> VideoMessageComponent
const music_queue = new Map<string, Queue>();
export default music_queue;
