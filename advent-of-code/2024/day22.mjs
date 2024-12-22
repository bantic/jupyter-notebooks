import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day22.txt", "utf8").trim();

let toInt = v => parseInt(v);
let toBigInt = v => BigInt(parseInt(v));
let parse = data => data.split('\n').map(toBigInt);
let veceq = (v1,v2) => v1.length === v2.length && v1.every((v,idx) => v === v2[idx]);

let PRUNE = BigInt((1 << 24) - 1);
// let PRUNE_MOD = (1 << 24)n;
let next = v => {
  assert(typeof v === 'bigint');
  let v1 = ((v * 64n) ^ v) & PRUNE;
  let v2 = (((v1 / 32n) | 0n) ^ v1) & PRUNE;
  let v3 = ((v2 * 2048n) ^ v2) & PRUNE;
  return v3;
}
let nextN = (v,n) => {
  if (n === 0) return v;
  return nextN(next(v), n-1);
}

let memoize = (fn,hash=JSON.stringify) => {
  let cache = new Map();
  return (...args) => {
    let key = hash(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
};
next = memoize(next, (bigv) => bigv.toString());

// test on test data
assert(nextN(123n,1) === 15887950n);
assert(nextN(123n,2) === 16495136n);
let expected = [ 15887950, 16495136, 527345, 704524, 1553684, 12683156, 11100544, 12249484, 7753432, 5908254
].map(BigInt);
let actual = new Array(10).fill(0).map((_,i) => nextN(123n,i+1));
assert(veceq(expected,actual));

assert(nextN(1n,2000) === 8685429n);
assert(nextN(10n,2000) === 4700978n);
assert(nextN(100n,2000) === 15273692n);
assert(nextN(2024n,2000) === 8667524n);

let sumB = arr => arr.reduce((acc,m) => acc+m,0n);

let solve = data => {
  return sumB(parse(data).map(v => nextN(v,2000)));
}

console.log({p1: solve(data)});
