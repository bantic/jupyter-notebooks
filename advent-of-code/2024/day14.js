fs = require("node:fs");
data = fs.readFileSync("./data/day14.txt", "utf8").trim();
width=101,height=103;

// data = fs.readFileSync("./data/day14-test.txt", "utf8").trim();
// width=11,height=7;

toInt = (v) => parseInt(v);
toInts = (str) => Array.from(str.matchAll(/-?\d+/g)).map(toInt);
OUT = Symbol("out");
wrap = (v,max) => {
  while (v >= max) { v -= max; }
  while (v < 0) { v += max; }
  return v;
}
wrapX = v => wrap(v,width);
wrapY = v => wrap(v,height);
prod = arr => arr.reduce((acc,m) => acc*m,1);
counter = arr => arr.reduce((acc,m) => {
  acc[m] ??= 0;
  acc[m] += 1;
  return acc;
},{});
moveB = ([x, y, dx, dy]) => [wrapX(x + dx), wrapY(y + dy), dx, dy];
toQ = (pos) => {
  let [x,y] = pos;
  NONE = Symbol();
  let midY = (height-1)/2;
  let midX = (width-1)/2;
  qY = y < midY ? 0 : y > midY ? 1 : NONE;
  qX = x < midX ? 0 : x > midX ? 1 : NONE;
  if ([qY,qX].includes(NONE)) { return 'none'; }
  return [qX,qY].join(',');
}
bots = data.split('\n').map(toInts);

console.log(bots);
// b = bots[10]
// for (let i = 0; i < 6; i++) {
//   console.log(i,JSON.stringify(b));
//   b = moveB(b);
// }

for (let i = 0; i < 100; i++) {
  bots = bots.map(moveB);
}
console.log(bots);
byQ = {};
let qs = bots.map(b => toQ(b)).filter(q => q !== 'none');
let counts = counter(qs);
let p1 = prod(Object.values(counts));
console.log({p1});
