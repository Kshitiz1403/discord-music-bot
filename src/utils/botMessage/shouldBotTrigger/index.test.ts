import shouldBotTrigger from ".";
import { expect, it } from "vitest";

it("should fail if the message string starts with anything other than 8", () => {
  const messageString = "===8====D Hello";

  const result = shouldBotTrigger(messageString);

  expect(result).toBe(false);
});

it("should fail if the prefix of message string ends with anything other than D", () => {
  const messageString = "8====D=== Hello";

  const result = shouldBotTrigger(messageString);

  expect(result).toBe(false);
});

it("should fail if there are characters apart from '=' in the prefix of message string ", () => {
  const messageString = "8===??%DD Hello";

  const result = shouldBotTrigger(messageString);

  expect(result).toBe(false);
});

it("should fail if there are no '=' in the prefix of message string ", () => {
  const messageString = "8D Hello";

  const result = shouldBotTrigger(messageString);

  expect(result).toBe(false);
});

it("should pass if the message string starts with '8', has atleast 1 '=' in the prefix, and 'D' at the end of the prfix of message string ", () => {
  const messageString = "8=D Hello";

  const result = shouldBotTrigger(messageString);

  expect(result).toBe(true);
});

it("should pass if the message string starts with '8', has more than 1 '=' in the prefix, and 'D' at the end of the prfix of message string ", () => {
  const messageString = "8======D Hello";

  const result = shouldBotTrigger(messageString);

  expect(result).toBe(true);
});
