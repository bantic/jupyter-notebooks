import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day22.txt", "utf8").trim();

let toInt = v => parseInt(v);
// let toBigInt = v => BigInt(parseInt(v));
let parse = data => data.split('\n').map(toInt);
let veceq = (v1,v2) => v1.length === v2.length && v1.every((v,idx) => v === v2[idx]);

let PRUNE = BigInt((1 << 24) - 1);
// let PRUNE_MOD = (1 << 24)n;
let next = v => {
  v = BigInt(v);
  let v1 = ((v * 64n) ^ v) & PRUNE;
  let v2 = (((v1 / 32n) | 0n) ^ v1) & PRUNE;
  let v3 = ((v2 * 2048n) ^ v2) & PRUNE;
  return v3;
}
let nextN = (v,n) => {
  if (n === 0) return Number(v);
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
assert(nextN(123,1) === 15887950);
assert(nextN(123,2) === 16495136);
let expected = [ 15887950, 16495136, 527345, 704524, 1553684, 12683156, 11100544, 12249484, 7753432, 5908254
];
let actual = new Array(10).fill(0).map((_,i) => nextN(123,i+1));
assert(veceq(expected,actual));

assert(nextN(1,2000) === 8685429);
assert(nextN(10,2000) === 4700978);
assert(nextN(100,2000) === 15273692);
assert(nextN(2024,2000) === 8667524);

let sum = arr => arr.reduce((acc,m) => acc+m,0);

let solve = data => {
  return sum(parse(data).map(v => nextN(v,2000)));
}

let getSeq = (v,len) => {
  let seq = [];
  for (let i = 0; i < len; i++) {
    v = next(v);
    seq.push(Number(v));
  }
  return seq;
}

let getPriceSeq = (v,len) => {
  return getSeq(v,len).map(v => v % 10);
}

let solve2 = data => {
  let uniqPriceSeqs = new Set();
  let seqs = parse(data).reduce((acc,v) => {
    let seq   = getPriceSeq(v,2000);
    let bestPriceSequencesByPrice = new Map();
    for (let i = 4; i < seq.length; i++) {
      let price = seq[i];
      if (bestPriceSequencesByPrice.has(price)) continue;
      let [p1,p2,p3,p4,p5] = seq.slice(i-4,i+1);
      assert(p5 === price);
      let diffs = [p2-p1,p3-p2,p4-p3,p5-p4];
      bestPriceSequencesByPrice.set(price, JSON.stringify(diffs));
      uniqPriceSeqs.add(JSON.stringify(diffs));
    }
    acc.set(v,{prices: seq, bestPriceSequencesByPrice});
    return acc;
  }, new Map());

  debugger;
}

console.log({p1: solve(data)});
solve2(data);
