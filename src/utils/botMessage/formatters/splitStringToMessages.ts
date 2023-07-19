function splitStringToMessages(inputString, maxMessageLength) {
  const lines = inputString.split("\n");
  const messages = [];
  let currentMessage = "";

  for (const line of lines) {
    if (currentMessage.length + line.length + 1 <= maxMessageLength) {
      currentMessage += line + "\n";
    } else {
      messages.push(currentMessage);
      currentMessage = line + "\n";
    }
  }

  if (currentMessage.trim() !== "") {
    messages.push(currentMessage);
  }

  return messages;
}

export default splitStringToMessages;
