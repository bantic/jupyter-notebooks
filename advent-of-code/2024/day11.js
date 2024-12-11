fs = require("node:fs");
data = fs.readFileSync("./data/day11.txt", "utf8").trim();
testData = `125 17`;
toInt = (v) => parseInt(v);
toInts = (str) => Array.from(str.matchAll(/-?\d+/g)).map(toInt);
nums = toInts(data);

let sum = (arr) => arr.reduce((acc, m) => acc + m, 0);
let blink = (v, steps = 0) => {
  if (steps === 0) {
    return 1;
  }
  let next;
  if (v === 0) {
    next = [1];
  } else if (`${v}`.length % 2 === 0) {
    let vstr = `${v}`;
    let len = vstr.length;
    next = [parseInt(vstr.slice(0, len / 2)), parseInt(vstr.slice(len / 2))];
  } else {
    next = [v * 2024];
  }
  return sum(next.flatMap((v) => blink(v, steps - 1)));
};
let memoize = (fn) => {
  let hash = (...args) => {
    return JSON.stringify(args);
  };
  let cache = new Map();
  return (...args) => {
    let key = hash(...args);
    if (!cache.get(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
};
blink = memoize(blink);

p1 = sum(nums.map((v) => blink(v, 25)));
p2 = sum(nums.map((v) => blink(v, 75)));
console.log({ p1 });
console.log({ p2 });
