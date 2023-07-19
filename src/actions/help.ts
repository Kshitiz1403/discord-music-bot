import { Message, bold, codeBlock } from "discord.js";

const help = (message: Message) => {
  const content =
    "\uD83D\uDC81\u200D\u2642\uFE0F Help\r\n\r\nPrefix - \r\n8==D (size doesn\'t matter \uD83D\uDE09)\r\n\r\nCommands (case insensitive) - \r\n1. play - Add a song to the queue or play directly from a YouTube URL or search query.\r\n2. playlist - Adds first 50 songs from the YouTube playlist URL.  \r\n3. pause - Pauses the currently playing song.\r\n4. resume - Resumes the currently playing song.\r\n5. skip - Skips the current song in the queue. If there are no more songs, stops the player.\r\n6. skiplist - Skips the current playing playlist (if any).\r\n7. stop - Stops the playback, clears the queue.\r\n8. queue - Displays the current playing song and the queued songs.\r\n9. help - You\'re already here.\r\n\r\n> Contribute at - https:\/\/github.com\/Kshitiz1403\/discord-yt-bot";
  message.channel.send(bold(codeBlock(content)));
};

export default help;
