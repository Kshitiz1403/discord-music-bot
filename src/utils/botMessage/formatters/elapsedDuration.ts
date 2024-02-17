function elapsedDuration(durationElapsed: number, totalTime: number): string {
  const maxLength = 69; // noice

  const completedRatio = durationElapsed / totalTime;
  const completedPercentage = Math.floor(completedRatio * 100);

  const completed = Math.floor(completedRatio * maxLength);
  const template = `[${"-".repeat(completed)}${" ".repeat(
    maxLength - completed
  )}] ${completedPercentage}%`;
  return template;
}

export default elapsedDuration;
