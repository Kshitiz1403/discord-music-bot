import { Message, bold, codeBlock } from "discord.js";

const help = (message: Message) => {
  const content =
    "\uD83D\uDC81\u200D\u2642\uFE0F Help\r\n\r\nPrefix - \r\n8==D (size doesn't matter \uD83D\uDE09)\r\n\r\nCommands (case insensitive) - \r\n1. play - Add a song to the queue or play directly from a YouTube URL or search query.\r\n2. pause - Pauses the currently playing song.\r\n3. resume - Resumes the currently playing song.\r\n4. skip - Skips the current song in the queue. If there are no more songs, stops the player.\r\n5. queue - Displays the current playing song and the queued songs.\r\n6. help - You're already here.\r\n\r\n> Contribute at - https://github.com/Kshitiz1403/discord-yt-bot";
  message.channel.send(bold(codeBlock(content)));
};

export default help;
