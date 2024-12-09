fs = require("node:fs");
data = fs.readFileSync("./data/day9.txt", { encoding: "utf8" }).trim();
toInt = (v) => parseInt(v);
nums = data.split("").map(toInt);
diskIdx = 0;
disk = [];
FREE = ".";
nums.forEach((count, idx) => {
  if (idx % 2 === 0) {
    let id = idx / 2;
    for (let i = 0; i < count; i++) {
      disk[diskIdx] = id;
      diskIdx++;
    }
  } else {
    for (let i = 0; i < count; i++) {
      disk[diskIdx] = FREE;
      diskIdx++;
    }
  }
});
findNextIndex = (arr, cb, from = 0) => from + arr.slice(from).findIndex(cb);
findNextFree = (from = 0) => findNextIndex(disk, (v) => v === FREE, from);
for (
  let j = disk.length - 1, freeIdx = findNextFree();
  freeIdx >= 0 && j >= freeIdx;
  j--
) {
  if (disk[j] !== FREE) {
    disk[freeIdx] = disk[j];
    disk[j] = FREE;
  }
  freeIdx = findNextFree(freeIdx);
}
checksum = (arr) =>
  arr.reduce((acc, v, idx) => (acc += v === FREE ? 0 : v * idx), 0);
console.log({ p1: checksum(disk) });
