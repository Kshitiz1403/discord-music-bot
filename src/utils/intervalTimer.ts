function IntervalTimer(callback, interval: number) {
  let timerId: NodeJS.Timer;
  let startTime: Date;
  let remaining: number = 0;
  var state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

  const pause = function () {
    if (state != 1) return;

    remaining = interval - (new Date().getTime() - startTime.getTime());
    clearInterval(timerId);
    state = 2;
  };

  const resume = function () {
    if (state != 2) return;

    state = 3;
    setTimeout(this.timeoutCallback, remaining);
  };

  const timeoutCallback = function () {
    if (state != 3) return;

    callback();

    startTime = new Date();
    timerId = setInterval(callback, interval);
    state = 1;
  };

  startTime = new Date();
  timerId = setInterval(callback, interval);
  state = 1;

  return { pause, resume, timeoutCallback };
}

export default IntervalTimer;
