import { expect, it } from "vitest";
import getMessageContent from ".";

it("should throw an error if a wrong bot prefix has been supplied while trying to get the message", () => {
  const messageString = "==8====D Play Ye Fitoor Mera";
  const resultFn = () => getMessageContent(messageString);

  expect(resultFn).toThrow(
    "The message does not have a valid bot trigger prefix"
  );
});

it("dsakdjaskl", () => {
  const messageString = "8====D SKIP GEBBERISH 512";
  const resultFn = getMessageContent(messageString);
  expect(resultFn).toEqual({ command: "SKIP", message: "GEBBERISH 512" });
});

it("should fail if there's no content in the message string", () => {
  const messageString = "8====D";
  const resultFn = () => getMessageContent(messageString);

  expect(resultFn).toThrow(
    "The message does not have a valid bot trigger prefix"
  );
});

it("should fail if there's no command in the message string", () => {
  const messageString = "8====D ";
  const resultFn = getMessageContent(messageString);

  expect(resultFn).toEqual({ command: "", message: "" });
});
