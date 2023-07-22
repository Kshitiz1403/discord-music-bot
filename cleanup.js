const fs = require("fs");
const path = require("path");

const OUTPUTS_DIRECTORY = path.join(__dirname, "./outputs");

const NOW = new Date();

dirItemsRemove(OUTPUTS_DIRECTORY);

function readdirSync(p, a = []) {
  if (fs.statSync(p).isDirectory())
    fs.readdirSync(p).map((f) =>
      readdirSync(a[a.push(path.join(p, f)) - 1], a)
    );
  return a;
}

function dirItemsRemove(DIRECTORY_PATH) {
  const files = readdirSync(DIRECTORY_PATH);
  console.log(files);
  files.map((file) => {
    const stats = fs.statSync(file);
    const createdAt = stats.ctime;

    if (NOW.getTime() - createdAt.getTime() > 1 * 24 * 60 * 60 * 1000) { // 1 day
      fs.rmSync(file, { recursive: true, force: true });
    }
  });
}
