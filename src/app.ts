import dotenv from "dotenv";
dotenv.config();
import path from "path";
global.appRoot = path.resolve(__dirname, "..");
import config from "../config";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { shouldBotTrigger, getMessageContent } from "./utils/botMessage";
import COMMANDS from "./enums/commands";
import { loadYT_API_Key } from "./utils/youtube/yt_api_service";
import select from "./actions/select";
import pause from "./actions/player/pause";
import resume from "./actions/player/resume";
import skip from "./actions/player/skip";
import showPlaying from "./actions/player/showPlaying";
import help from "./actions/help";

loadYT_API_Key();

const main = async () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  await client.login(config.token);

  client.once(Events.ClientReady, (c) => {
    console.log(`Bot is online!`);

    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  client.on(Events.MessageCreate, async (message) => {
    const content = message.content;
    if (!shouldBotTrigger(content)) return;

    const { message: messageContent, command } = getMessageContent(content);

    switch (command.toLowerCase()) {
      case COMMANDS.PLAY.toLowerCase():
        select(messageContent, message);
        break;
      case COMMANDS.PAUSE.toLowerCase():
        pause(message);
        break;
      case COMMANDS.RESUME.toLowerCase():
        resume(message);
        break;
      case COMMANDS.SKIP.toLowerCase():
        skip(message);
        break;
      case COMMANDS.QUEUE.toLowerCase():
        showPlaying(message);
        break;
      case COMMANDS.HELP.toLowerCase():
        help(message);
        break;
    }
  });
};

main();
