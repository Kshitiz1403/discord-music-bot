import shouldBotTrigger from "../shouldBotTrigger";

const getMessageContent = (messageString: string) => {
  if (!shouldBotTrigger(messageString))
    throw "The message does not have a valid bot trigger prefix";
  const message = messageString.substring(
    messageString.indexOf(" ") == -1
      ? messageString.length
      : +messageString.indexOf(" ") + 1
  );
  const command = message.split(" ")[0];
  const actualMessage = message.substring(
    message.indexOf(command) + command.length + 1
  );

  return { command: command || "", message: actualMessage || "" };
};

export default getMessageContent;
