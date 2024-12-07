fs = require("node:fs");
data = fs.readFileSync("./data/day5.txt", { encoding: "utf8" });
toInts = (str) => Array.from(str.matchAll(/\d+/g)).map((v) => parseInt(v));
let [pairs, seqs] = data.split("\n").reduce(
  ([pairs, seqs], line) => {
    line.includes("|") && pairs.push(toInts(line));
    line.includes(",") && seqs.push(toInts(line));
    return [pairs, seqs];
  },
  [[], []]
);
befores = pairs.reduce((map, [lo, hi]) => {
  map[hi] ??= [];
  map[hi].push(lo);
  return map;
}, {});
afters = pairs.reduce((map, [lo, hi]) => {
  map[lo] ??= [];
  map[lo].push(hi);
  return map;
}, {});
isAfter = (rhs, lhs) => !(afters[rhs] || []).includes(lhs);
isStrictlyAfter = (rhs, lhs) => (afters[lhs] || []).includes(rhs);
isStrictlyBefore = (lhs, rhs) => (befores[rhs] || []).includes(lhs);
allNums = Array.from(
  pairs.reduce((set, [lo, hi]) => {
    set.add(lo);
    set.add(hi);
    return set;
  }, new Set())
);
console.log(allNums);
sortedNums = allNums.toSorted((lhs, rhs) =>
  isStrictlyBefore(lhs, rhs) ? -1 : isStrictlyAfter(rhs, lhs) ? 1 : 0
);
console.log(sortedNums);
sortedNums = allNums.toSorted((lhs, rhs) =>
  isStrictlyBefore(lhs, rhs) ? -1 : isStrictlyAfter(rhs, lhs) ? 1 : 0
);
console.log(sortedNums);
isIncreasing = (arr) =>
  arr.reduce(
    (isInc, v, idx) => isInc && (idx === 0 || v >= arr[idx - 1]),
    true
  );
// isValid = (seq) => {
//   for (let i = 0; i < seq.length; i++) {
//     let lhs = seq[i],
//       rest = seq.slice(i + 1);
//     if (rest.some((rhs) => !isAfter(rhs, lhs))) {
//       return false;
//     }
//   }
//   return true;
// };
isValid = (seq) => {
  return isIncreasing(seq.map((v) => sortedNums.indexOf(v)));
};
isNotValid = (seq) => !isValid(seq);
mid = (arr) => arr.at(Math.floor(arr.length / 2));
sum = (arr) => arr.reduce((sum, v) => sum + v, 0);
p1 = sum(seqs.filter(isValid).map(mid));
sort = (arr) => arr.toSorted((lhs, rhs) => (!isAfter(lhs, rhs) ? -1 : 1));
p2 = sum(seqs.filter(isNotValid).map(sort).map(mid));
console.log({ p1, p2 });
