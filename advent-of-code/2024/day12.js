fs = require("node:fs");
assert = require("node:assert");
data = fs.readFileSync("./data/day12-test.txt", "utf8").trim();
data = fs.readFileSync("./data/day12.txt", "utf8").trim();
grid = data.split("\n").map((l) => l.split(""));
OUT = Symbol("out");
get = ([x, y]) => grid[y]?.[x] ?? OUT;
namedDirs = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};
dirs = Object.values(namedDirs);
move = ([x, y], [dx, dy]) => [x + dx, y + dy];
toKey = (pos) => pos.join(",");
sum = (arr) => arr.reduce((acc, m) => acc + m, 0);
countUniq = (arr) => new Set(arr).size;
let inGrid = ([x, y]) => get([x, y]) !== OUT;
grid[Symbol.iterator] = function* () {
  let minY = 0,
    maxY = grid.length;
  let minX = 0,
    maxX = grid[0].length;
  for (let x = minX; x < maxX; x++) {
    for (let y = minY; y < maxY; y++) {
      yield [x, y];
    }
  }
};

segment = (grid, dirs) => {
  let regions = [];
  let seen = new Set();
  for (let pos of grid) {
    if (seen.has(toKey(pos))) continue;
    let region = fill(pos, dirs);
    for (let pos of region) {
      seen.add(toKey(pos));
    }
    regions.push(region);
  }
  return regions;
};

fill = (pos, dirs) => {
  let v = get(pos);
  let seen = new Set();
  let region = [];
  let stack = [pos];
  while (stack.length) {
    let pos = stack.pop();
    if (seen.has(toKey(pos))) continue;
    seen.add(toKey(pos));
    region.push(pos);
    let moves = dirs
      .map((d) => move(pos, d))
      .filter(inGrid)
      .filter((p) => get(p) === v);
    stack = [...stack, ...moves];
  }
  return region;
};
getPerimeter = (region) => {
  let perim = 0;
  for (let pos of region) {
    let v = get(pos);
    let moves = dirs.map((d) => move(pos, d)).filter((p) => get(p) === v);
    perim += dirs.length - moves.length;
  }
  return perim;
};
adjoins = ([x1, y1], [x2, y2]) => {
  let dx = Math.abs(x2-x1);
  let dy = Math.abs(y2-y1);
  return (dx+dy) === 1;
};
sortXYAsc = (region) => {
  return region.toSorted(([x1, y1], [x2, y2]) => {
    return x2 > x1 ? -1 : x2 < x1 ? 1 : y2 > y1 ? -1 : y2 < y1 ? 1 : 0;
  });
};
getSides = (region) => {
  let tops = [];
  let bottoms = [];
  let lefts = [];
  let rights = [];
  let {up,down,left,right} = namedDirs;
  for (let pos of region) {
    let v = get(pos);
    for (let [bucket,dir] of [
      [tops,up],
      [bottoms,down],
      [lefts,left],
      [rights,right],
    ]) {
      let next = move(pos,dir);
      if (get(next) !== v) {
        bucket.push(next);
      }
    }
  }
  return sum([tops,bottoms,lefts,rights].map(pos_s => countNonAdjoining(pos_s)));
};
countNonAdjoining = (pos_s) => {
  let seen = [];
  let stack = sortXYAsc(pos_s);
  let count = 0;
  while (stack.length) {
    let pos = stack.shift();
    // this check assumes they are sorted, otherwise we could see
    // opposite corners of the same side and count it 2x
    if (!seen.some(p => adjoins(p,pos))) {
      count += 1;
    }
    seen.push(pos);
  }
  return count;
}
getArea = region => region.length;

let regions = segment(grid, dirs);

let p1 = sum(regions.map((r) => getArea(r) * getPerimeter(r)));
let p2 = sum(regions.map((r) => getArea(r) * getSides(r)));
console.log({ p1, p2 });
