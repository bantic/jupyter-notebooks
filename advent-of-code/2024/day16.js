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

// data = testdata;

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

hash = JSON.stringify;
search = (grid,startPos,startHeading,targetPos) => {
  let seenStates = new Map();
  let posCost = new Map();

  let startState = [startPos,startHeading,0];
  let stack = [ startState ];
  while (stack.length) {
    let state = stack.shift();
    let [pos,heading,cost] = state;
    let stateKey = hash([pos,heading]);
    if (seenStates.has(stateKey)) {
      let prevCost = seenStates.get(stateKey);
      if (cost >= prevCost) {
        continue;
      }
    }
    seenStates.set(stateKey, cost);

    let posKey = hash(pos);
    let prevPosCost = posCost.get(posKey) ?? Infinity;
    if (prevPosCost < cost) {
      continue;
    }
    posCost.set(posKey, Math.min(prevPosCost, cost));
    if (eqArr(pos,targetPos)) {
      continue;
    }
    let next = nearby(grid,state).map(([nextPos,nextHeading,nextCost]) => {
      return [nextPos,nextHeading,cost+nextCost];
    });
    stack = [...next, ...stack];
  }

  return posCost;
}

let startPos = findPos(grid,'S'), targetPos = findPos(grid,'E');
let posCosts = search(grid, startPos, E, targetPos);
let p1 = posCosts.get(hash(targetPos));
console.log({p1});

search2 = (grid,startPos,startHeading,targetPos,targetCost) => {
  let seenStates = new Map();
  let posCost = new Map();
  let bestPaths = [];
  let uniqBestPos = new Set();

  let startState = [startPos,startHeading,0,[startPos]];
  let stack = [ startState ];
  while (stack.length) {
    let state = stack.shift();
    let [pos,heading,cost,path] = state;
    if (cost > targetCost) continue;
    let stateKey = hash([pos,heading]);
    if (seenStates.has(stateKey)) {
      let prevCost = seenStates.get(stateKey);
      if (cost > prevCost) {
        continue;
      }
    }
    seenStates.set(stateKey, cost);

    // let posKey = hash(pos);
    // let prevPosCost = posCost.get(posKey) ?? Infinity;
    // if (prevPosCost < cost) {
    //   continue;
    // }
    // posCost.set(posKey, Math.min(prevPosCost, cost));
    if (eqArr(pos,targetPos)) {
      assert(cost >= targetCost);
      if (cost === targetCost) {
        path.forEach(p => uniqBestPos.add(hash(p)));
        // bestPaths.push(path);
      }
      continue;
    }
    let next = nearby(grid,state).map(([nextPos,nextHeading,nextCost]) => {
      return [nextPos,nextHeading,cost+nextCost, path.concat([nextPos])];
    });
    stack = [...next, ...stack];
  }

  // let uniqBestPos = new Set();
  // bestPaths.forEach(path => path.forEach(p => uniqBestPos.add(hash(p))));
  return uniqBestPos;
}

let bestPos = search2(grid,startPos,E,targetPos,p1);
let p2 = bestPos.size;
console.log({p2});
