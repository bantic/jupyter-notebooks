fs = require("node:fs");
assert = require('node:assert');
data = fs.readFileSync("./data/day16.txt", "utf8").trim();
testdata = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############
`.trim();

testdata2 = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`.trim();

WALL='#'
SPACE='.'
parse = data => data.split('\n').map(l => l.split(''));
get = (grid,pos) => grid[pos[1]][pos[0]];
findPos = (grid,v) => {
  let y = grid.findIndex(l => l.includes(v));
  let x = grid[y].indexOf(v);
  return [x,y];
}

grid = parse(data);
start = findPos(grid,'S');
end = findPos(grid,'E');
N = [0,-1];
E = [1,0];
S = [0,1];
W = [-1,0];
eqArr = (arr1,arr2) => {
  if (arr1.length !== arr2.length) { return false; }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) { return false; }
  }
  return true;
}
eq2 = eqArr;
assert(eqArr([1,2,3],[1,2,3]));
dirs = [N,E,S,W];
rotR = dir => dirs[ (dirs.indexOf(dir) + 1) % dirs.length ];
rotL = dir => dirs.at( dirs.indexOf(dir) - 1 );
assert(eq2(rotR(N),E));
assert(eq2(rotR(W),N));
assert(eq2(rotL(W),S));
assert(eq2(rotL(N),W));
console.log(start,end);
addArr = (arr1,arr2) => {
  assert(arr1.length===arr2.length);
  return arr1.reduce((acc,_,idx) => {
    acc[idx] = arr1[idx] + arr2[idx];
    return acc;
  }, []);
}

nearby = (grid,state) => {
  let [pos,heading] = state;
  return [
    [addArr(pos,heading),heading, 1],
    [addArr(pos,rotR(heading)), rotR(heading), 1001],
    [addArr(pos,rotL(heading)), rotL(heading), 1001],
  ].filter(([pos,_heading,_cost]) => get(grid,pos) !== WALL);
}

search = (grid,startPos,startHeading,targetPos) => {
  let seenStates = new Map();
  let posCost = new Map();
  let hash = JSON.stringify;

  let startState = [startPos,startHeading,0];
  let stack = [ startState ];
  while (stack.length) {
    let state = stack.shift();
    let [pos,heading,cost] = state;
    let key = hash([pos,heading]);
    if (seenStates.has(key)) {
      let prevCost = seenStates.get(key);
      if (cost >= prevCost) {
        continue;
      }
    }
    seenStates.set(key, cost);

    let prevPosCost = posCost.get(hash(pos)) ?? Infinity;
    if (prevPosCost < cost) {
      continue;
    }
    posCost.set(hash(pos), Math.min(prevPosCost, cost));
    if (eqArr(pos,targetPos)) {
      continue;
    }
    let next = nearby(grid,state).map(([nextPos,nextHeading,nextCost]) => {
      return [nextPos,nextHeading,cost+nextCost];
    });
    stack = [...next, ...stack];
  }

  return posCost.get(hash(targetPos));
}

let p1 = search(grid, findPos(grid,'S'), E, findPos(grid,'E'));
console.log(p1);
