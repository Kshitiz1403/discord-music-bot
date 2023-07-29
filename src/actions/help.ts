import { Message, bold, codeBlock } from "discord.js";

const help = (message: Message) => {
  const content =
    "\uD83D\uDC81\u200D\u2642\uFE0F Help\r\n\r\nPrefix - \r\n8==D (size doesn\'t matter \uD83D\uDE09)\r\n\r\nCommands (case insensitive) - \r\n1. play - Adds a song to the queue or play directly from a YouTube URL.\r\n2. search - Shows suggestions based on search query.\r\n3. playlist - Adds first 50 songs from the YouTube playlist URL.  \r\n4. pause - Pauses the currently playing song.\r\n5. resume - Resumes the currently playing song.\r\n6. skip - Skips the current song in the queue. If there are no more songs, stops the player.\r\n7. skiplist - Skips the current playing playlist (if any).\r\n8. stop - Stops the playback, clears the queue.\r\n9. queue - Displays the current playing song and the queued songs.\r\n10. help - You\'re already here.\r\n\r\n> Contribute at - https:\/\/github.com\/Kshitiz1403\/discord-yt-bot";
  message.channel.send(bold(codeBlock(content)));
};

export default help;
