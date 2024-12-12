fs = require("node:fs");
assert = require("node:assert");
data = fs.readFileSync("./data/day12-test.txt", "utf8").trim();
data = fs.readFileSync("./data/day12.txt", "utf8").trim();
grid = data.split('\n').map(l => l.split(''));
OUT = Symbol('out');
get = ([x,y]) => grid[y]?.[x] ?? OUT;
dirs = [[-1,0],[1,0],[0,1],[0,-1]];
move = ([x,y],[dx,dy]) => [x+dx,y+dy];
toKey = pos => pos.join(',');
sum = arr => arr.reduce((acc,m) => acc+m,0);
let inGrid = ([x,y]) => get([x,y]) !== OUT;
grid[Symbol.iterator] = function*() {
  let minY = 0, maxY = grid.length;
  let minX = 0, maxX = grid[0].length;
  for (let x = minX; x < maxX; x++) {
    for (let y = minY; y < maxY; y++) {
      yield [x,y];
    }
  }
}

segment = (grid,dirs) => {
  let regions = [];
  let seen = new Set();
  for (let pos of grid) {
    if (seen.has(toKey(pos))) continue;
    let region = fill(pos,dirs);
    for (let pos of region) {
      seen.add(toKey(pos));
    }
    regions.push(region);
  }
  return regions;
}

fill = (pos,dirs) => {
  let v = get(pos);
  let seen = new Set();
  let region = [];
  let stack = [pos];
  while (stack.length) {
    let pos = stack.pop();
    if (seen.has(toKey(pos))) continue;
    seen.add(toKey(pos));
    region.push(pos);
    let moves = dirs.map(d => move(pos,d)).filter(inGrid).filter(p => get(p) === v);
    stack = [...stack, ...moves];
  }
  return region;
}
perimeter = (region,dirs) => {
  let perim = 0;
  for (let pos of region) {
    let v = get(pos);
    let moves = dirs.map(d => move(pos,d)).filter(p => get(p) === v);
    perim += dirs.length - moves.length;
  }
  return perim;
}

let regions = segment(grid,dirs);

let p1 = sum(regions.map(r => {
  let area = r.length;
  let perim = perimeter(r,dirs);
  return area * perim;
}));
// 203874566 too high
console.log({p1})
