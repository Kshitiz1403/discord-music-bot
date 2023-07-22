import { AudioPlayer } from "@discordjs/voice";
import getOrCreatePlayer from "../actions/player/join";

interface IPlayer {
  guildId: string;
  voiceChannelId: string;
}

const players = new Map<string, AudioPlayer>();

const getKey = (player: IPlayer) => {
  const { guildId, voiceChannelId } = player;
  return JSON.stringify({ guildId, voiceChannelId });
};

export const hasPlayer = (player: IPlayer) => {
  const key = getKey(player);
  return players.has(key);
};

export const getPlayer = (player: IPlayer): AudioPlayer => {
  const key = getKey(player);
  return players.get(key);
};

export const deletePlayer = (player: IPlayer) => {
  const key = getKey(player);
  players.delete(key);
};

export const setPlayer = (playerParameters: IPlayer, player: AudioPlayer) => {
  const key = getKey(playerParameters);
  players.set(key, player);
};
