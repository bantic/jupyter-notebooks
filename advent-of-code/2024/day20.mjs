import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day20.txt", "utf8").trim();
let testdata = fs.readFileSync("./data/day20-test.txt", "utf8").trim();

// data = testdata;

let FREE = '.';
let WALL = '#';
let OUT = Symbol();
let E = [0,1];
let W = [0,-1];
let S = [1,0];
let N = [-1,0];
let DIRS = [N,E,S,W];

let parse = data => {
  let grid = [];
  let start, end;
  data.split('\n').map((line,y) => {
    grid[y] = line.split('');
    if (line.includes('S')) start = [line.indexOf('S'), y];
    if (line.includes('E')) end = [line.indexOf('E'), y];
  });
  grid.get = ([x,y]) => grid[y]?.[x] ?? OUT;
  grid[start[1]][start[0]] = FREE;
  grid[end[1]][end[0]] = FREE;
  return {grid,start,end};
}

let vecadd = (v1,v2) => {
  assert(v1.length === v2.length);
  return v1.map((_,idx) => v1[idx]+v2[idx]);
};
let veceq = (v1,v2) => v1.length === v2.length && v1.every((v,idx) => v === v2[idx]);
let vecmul = (v1,mul) => v1.map(v => v*mul);
let sum = arr => arr.reduce((acc,m) => acc+m,0);
let manhattanDistance = (v1,v2) => {
  if (v1.length !== v2.length) debugger;
  assert(v1.length === v2.length);
  return sum(vecadd(vecmul(v1,-1),v2).map(Math.abs));
}
let md = manhattanDistance;
assert(veceq([1,2],[1,2]));
assert(!veceq([1,2],[2,2]));
assert(veceq(vecadd([0,1],[1,5]), [1,6]));
let n4 = p => DIRS.map(d => vecadd(d,p));
let hash = JSON.stringify;
let cheats8 = p => {
  return [
    [N,N],
    [N,W],
    [W,W],
    [W,S],
    [S,S],
    [S,E],
    [E,E],
    [E,N]
  ].map(([d1,d2]) => {
    let p1 = vecadd(d1,p);
    let p2 = vecadd(d2,p1);
    return [p1,p2]
  });
}

let traverse = (grid,start,end) => {
  let path = [];
  let costs = new Map();
  let pos = start;
  let steps = 0;
  while (true) {
    costs.set(hash(pos),steps);
    path.push(pos);

    if (veceq(pos,end)) break;

    let next = n4(pos)
      .filter(p => grid.get(p) === FREE)
      .filter(p => !costs.has(hash(p)));
    assert(next.length === 1);
    pos = next[0];
    steps += 1;
  }
  return [path,costs];
}

let solve = data => {
  let {grid,start,end} = parse(data);
  let [path,costs] = traverse(grid,start,end);
  let cheatCosts = new Map();

  for (let p of path) {
    let pCost = costs.get(hash(p));

    let valid = cheats8(p).filter(([p1,p2]) => grid.get(p1) === WALL && grid.get(p2) === FREE);
    let newValid = valid.filter(cheat => !cheatCosts.has(hash(cheat)));

    for (let cheat of newValid) {
      assert(!veceq(cheat[0],end)); // shouldn't be possible

      let oldCost = costs.get(hash(cheat[1]));
      let newCost = pCost + 2;
      let save = oldCost - newCost;
      cheatCosts.set(hash(cheat), save);
    }
  }

  return Array.from(cheatCosts.entries()).filter(([cheat,savings]) => savings >= 100).length;
}

// let p1 = solve(data);
// console.log({p1});

let solve2 = data => {
  let {grid,start,end} = parse(data);
  let [path,costs] = traverse(grid,start,end);
  let maxlen = 20;

  let cheatCosts = new Map();

  let _idx = 0;
  for (let i = 0; i < path.length; i++) {
    _idx++;
    if (_idx % 100 === 0) { console.log(_idx,path.length); }

    let p = path[i];
    let pCost = costs.get(hash(p));
    for (let j = i+1; j < path.length; j++) {
      let cend = path[j];
      if ((md(p,cend)) > maxlen) continue;
      let cheat = [p, cend];
      let oldCost = costs.get(hash(cend));
      let newCost = pCost + md(cheat[0], cheat[1]);
      let save = oldCost - newCost;
      cheatCosts.set(hash(cheat), save);
    }
  }

  debugger;
  let p2 = Array.from(cheatCosts.entries()).filter(([cheat,savings]) => savings >= 100).length;
  return p2;
}


let p2 = solve2(data);
console.log({p2});
