import { ITrack } from "./ITrack";

export type IPlaylist = ITrack[];

export type TypePlaylist = { type: "PLAYLIST"; videos: IPlaylist };
