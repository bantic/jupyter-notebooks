import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day19.txt", "utf8").trim();

let parse = data => {
  let [pats,rugs] = data.split('\n\n');
  pats = pats.split(', ');
  rugs = rugs.split('\n');
  return {pats,rugs};
}

let memoize = (fn) => {
  let hash = JSON.stringify;
  let cache = new Map();
  return (...args) => {
    let key = hash(...args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
};

let sum = arr => arr.reduce((acc,m) => acc+m, 0);

let solve = (data, {p1,p2}) => {
  let {pats,rugs} = parse(data);
  let count = rug => rug.length === 0 ||
    sum(pats.filter(p => rug.startsWith(p))
            .map(p => rug.slice(p.length))
            .map(count)
        );
  count = memoize(count);
  return p1 ? rugs.filter(count).length : sum(rugs.map(count));
}

let p1 = solve(data,{p1:true});
let p2 = solve(data,{p2:true});
console.log({p1,p2});
