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
let getAntinodes = ([[x1, y1], [x2, y2]]) => {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return [
    [x1 + 2 * dx, y1 + 2 * dy],
    [x2 - 2 * dx, y2 - 2 * dy],
  ];
};
let antinodes = [];
for (let node of Object.keys(nodes)) {
  let coords = nodes[node].map((v) => v.split(",").map(toInt));
  // console.log("node", node, coords);
  for (let pair of pairs(coords)) {
    // console.log(pair);
    for (let antinode of getAntinodes(pair)) {
      // console.log(antinode);
      if (inGrid(antinode)) {
        antinodes.push(antinode);
      }
    }
  }
}
let uniqueAntinodes = new Set(antinodes.map((pos) => pos.join(",")));
let p1 = uniqueAntinodes.size;

console.log({ p1 });
