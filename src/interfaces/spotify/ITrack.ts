export type TypeTrack = { type: "VIDEO" } & ITrack;

export interface ITrack {
  youtube_url: string;
  options: {
    videoId: string;
    title: string;
    duration: string;
    description: string;
  };
}
