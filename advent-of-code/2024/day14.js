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
parse = () => data.split('\n').map(toInts);
bots = parse()

print = (bots, width, height) => {
  let grid = [];
  for (let y = 0; y < height; y++) {
    let line = '.'.repeat(width).split('');
    grid.push(line);
  }
  for (let [x,y] of bots) {
    let v = grid[y][x];
    if (v === '.') {
      v = 1;
    } else {
      v = parseInt(v) + 1;
    }
    grid[y][x] = v;
  }
  console.log(grid.map(l => l.join('')).join('\n'));
}

for (let i = 0; i < 100; i++) {
  bots = bots.map(moveB);
}
byQ = {};
let qs = bots.map(b => toQ(b)).filter(q => q !== 'none');
let counts = counter(qs);
let p1 = prod(Object.values(counts));
console.log({p1});

bots = parse();
// Had a hunch that the xmas tree would only occur when no bots are on top of each other, and
// that turned out to be true
for (let i = 0; i < 15000; i++) {
  if (Object.values(counter(bots.map(([x,y]) => `${x},${y}`))).every(v => v === 1)) {
    console.log({p2:i});
    print(bots,width,height);
    break;
  }
  bots = bots.map(moveB);
}
