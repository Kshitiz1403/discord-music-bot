export interface IVideoSuggestion {
  videoId: string;
  duration: {
    hours: number;
    minutes: number;
    seconds: number;
    duration: number;
  };
  url: string;
  title: string;
}
