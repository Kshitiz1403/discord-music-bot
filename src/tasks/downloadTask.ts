/*
 */
import { v4 as uuidv4 } from "uuid";
import youtubeDl from "youtube-dl-exec";

interface ITask {
  taskID: string;
  status: Promise<any>;
  downloadPath: string;
  createdAt: Date;
  finishedAt?: Date;
}
const tasks = new Map<String, ITask>();

export const startDownloadTask = (youtube_url: string, outputPath: string) => {
  const taskID = uuidv4();

  const downloadPromise = youtubeDl.exec(youtube_url, {
    noCheckCertificates: true,
    noWarnings: true,
    preferFreeFormats: true,
    addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    format: "bestaudio/best[height<=480]",
    output: outputPath,
  });
  const task: ITask = {
    taskID,
    createdAt: new Date(),
    status: downloadPromise,
    downloadPath: outputPath,
  };
  downloadPromise.then(() => (task.finishedAt = new Date()));

  tasks.set(taskID, task);
};

export default tasks;
