import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day19.txt", "utf8").trim();

let parse = data => {
  let lines = data.split('\n');
  let pats = lines[0].split(', ');
  let rugs = lines.slice(2);
  return {pats,rugs};
}

console.log(parse(data));

let memoize = (fn) => {
  let hash = (...args) => {
    return JSON.stringify(args);
  };
  let cache = new Map();
  return (...args) => {
    let key = hash(...args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
};

let solve = data => {
  let {pats,rugs} = parse(data);
  let isMatch = (rug) => {
    if (rug.length === 0) return true;
    return pats.filter(p => rug.startsWith(p)).some(p => isMatch(rug.slice(p.length)));
  };
  isMatch = memoize(isMatch);

  let p1 = 0;
  for (let rug of rugs) {
    let matches = isMatch(rug);
    console.log(matches,rug);
    if (matches) { p1 += 1; }
  }
  return p1;
}

console.log({p1: solve(data)});
