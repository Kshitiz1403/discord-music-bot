/**
 * Idea is to follow a Round Robin Algorithm for rotating the API Key
 * Save the last used key in persistent storage.
 * If there's a 403 error (Qouta Exceeded/ Forbidden), rotate the key, update the persistent storage last key. (Client is responsible).
 */

import fs from "fs";
import path from "path";
import config from "../../../config";

let KEY = "";
let KEY_INDEX = -1;
const FILE_PATH = path.join(global.appRoot, "./round_robin_YT_KEY.txt");

export const loadYT_API_Key = () => {
  if (!fs.existsSync(FILE_PATH)) {
    KEY_INDEX = 0;
    saveKey();
    setKey();
    return;
  }
  KEY_INDEX = parseInt(fs.readFileSync(FILE_PATH, { encoding: "utf8" }));
  setKey();
};

export const getYT_API_Key = () => {
  if (!KEY) loadYT_API_Key();
  return KEY;
};

export const rotateKey = () => {
  const nextIndex = (KEY_INDEX + 1) % totalKeys();
  KEY_INDEX = nextIndex;
  saveKey();
  setKey();
};

export function totalKeys() {
  return config.youtube_api_keys.length;
}

function saveKey() {
  fs.writeFileSync(FILE_PATH, KEY_INDEX.toString());
}

function setKey() {
  KEY = config.youtube_api_keys[KEY_INDEX];
}
