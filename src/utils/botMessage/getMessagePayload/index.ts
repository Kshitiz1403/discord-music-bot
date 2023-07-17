import shouldBotTrigger from "../shouldBotTrigger";

const getMessagePayload = (messageContent: string) => {
  if (!shouldBotTrigger(messageContent))
    throw "The message does not have a valid bot trigger prefix";
  const message = messageContent.substring(
    messageContent.indexOf(" ") == -1
      ? messageContent.length
      : +messageContent.indexOf(" ") + 1
  );
  const command = message.split(" ")[0];
  const actualMessage = message.substring(
    message.indexOf(command) + command.length + 1
  );
  
  return { command: command || "", message: actualMessage || "" };
};

export default getMessagePayload;
