fs = require("node:fs");
assert = require("node:assert");
data = fs.readFileSync("./data/day10.txt", { encoding: "utf8" }).trim();
testdata = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`.trim();
toInt = (v) => parseInt(v);
grid = data.split("\n").map(l => l.split('').map(toInt));
dirs = [[-1,0],[1,0],[0,1],[0,-1]];
move = ([x,y],[dx,dy]) => [x+dx,y+dy];
OUT = Symbol('out');
get = ([x,y]) => grid[y]?.[x] ?? OUT;
inGrid = ([x,y]) => get([x,y]) !== OUT;
sum = arr => arr.reduce((acc,m) => acc+m,0);

heads = grid.flatMap((row, y) => row.map((v,x) => {
  return [v,x,y]
}).filter(([v,x,y]) => v === 0).map(([v,x,y]) => [x,y]));

follow = (pos,p1=false, seen=new Set()) => {
  let [x,y] = pos;
  let key = `${x},${y}`;
  if (p1) {
    if (seen.has(key)) return 0;
    seen.add(key);
  }
  let v = get(pos);
  if (v === 9) return 1;
  let moves = dirs.map(d => move(pos,d)).filter(inGrid).filter(pos => get(pos) - 1 === v);
  return sum(moves.map(m => follow(m,p1,seen)));
}

p1 = sum(heads.map(h => follow(h,true)));
p2 = sum(heads.map(h => follow(h,false)));
console.log({p1, p2});
