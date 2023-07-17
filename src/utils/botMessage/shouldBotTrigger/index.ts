const shouldBotTrigger = (messageContent: string): boolean => {
  try {
    if (!messageContent.startsWith("8")) return false;
    const prefix = messageContent
      .substring(0, messageContent.indexOf(" ") + 1)
      .trim();

    if (prefix.length < 3) return false;

    if (prefix[prefix.length - 1] != "D") return false;

    const infix = prefix.substring(1, prefix.length - 1);
    const allEqual = infix.split("").every((char) => char == "=");
    if (allEqual) return true;

    return false;
  } catch (error) {
    return false;
  }
};

export default shouldBotTrigger;
