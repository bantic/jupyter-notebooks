fs = require("node:fs");
data = fs.readFileSync("./data/day8.txt", { encoding: "utf8" }).trim();
grid = data.split("\n");
toInt = (v) => parseInt(v);
OUT = Symbol();
get = ([x, y]) => grid[y]?.[x] || OUT;
inGrid = ([x, y]) => get([x, y]) !== OUT;
let nodes = {};
for (let y = 0; y < grid.length; y++) {
  for (let match of grid[y].matchAll(/[a-z0-9]/gi)) {
    let node = match[0],
      x = match.index;
    nodes[node] ??= [];
    nodes[node].push(`${x},${y}`);
  }
}
let pairs = (arr) =>
  arr.flatMap((v1, idx) => arr.slice(idx + 1).map((v2) => [v1, v2]));
let getAntinodes = ([[x1, y1], [x2, y2]], part1 = true) => {
  let dx = x2 - x1;
  let dy = y2 - y1;
  if (part1) {
    return [
      [x1 + 2 * dx, y1 + 2 * dy],
      [x2 - 2 * dx, y2 - 2 * dy],
    ].filter(inGrid);
  } else {
    let antinodes = [];
    // +
    {
      let antinode = [x1, y1];
      while (inGrid(antinode)) {
        antinodes.push(antinode);
        let [x, y] = antinode;
        antinode = [x + dx, y + dy];
      }
    }
    // -
    {
      let antinode = [x2, y2];
      while (inGrid(antinode)) {
        antinodes.push(antinode);
        let [x, y] = antinode;
        antinode = [x - dx, y - dy];
      }
    }
    return antinodes.filter(inGrid);
  }
};
let antinodes1 = [];
let antinodes2 = [];
for (let node of Object.keys(nodes)) {
  let coords = nodes[node].map((v) => v.split(",").map(toInt));
  for (let pair of pairs(coords)) {
    antinodes1.push(...getAntinodes(pair, true));
    antinodes2.push(...getAntinodes(pair, false));
  }
}
let uniq = (nodes) => new Set(nodes.map((pos) => pos.join(",")));
let p1 = uniq(antinodes1).size;
let p2 = uniq(antinodes2).size;

console.log({ p1, p2 });
