import { expect, it } from "vitest";
import getMessagePayload from ".";

it("should throw an error if a wrong bot prefix has been supplied while trying to get the message", () => {
  const messageString = "==8====D Play Ye Fitoor Mera";
  const resultFn = () => getMessagePayload(messageString);

  expect(resultFn).toThrow(
    "The message does not have a valid bot trigger prefix"
  );
});

it("should fail if there's no content in the message string", () => {
  const messageString = "8====D";
  const resultFn = () => getMessagePayload(messageString);

  expect(resultFn).toThrow(
    "The message does not have a valid bot trigger prefix"
  );
});

it("should fail if there's no command in the message string", () => {
  const messageString = "8====D ";
  const resultFn = getMessagePayload(messageString);

  expect(resultFn).toEqual({ command: "", message: "" });
});
