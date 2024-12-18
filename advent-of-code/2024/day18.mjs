import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day18.txt", "utf8").trim();
let testdata = fs.readFileSync("./data/day18-test.txt", "utf8").trim();
import TinyQueue from 'tinyqueue';
let toInt = v => parseInt(v);
let toInts = str => Array.from(str.matchAll(/\d+/g)).map(toInt);

// data = testdata;

let BOX = '#';
let FREE = '.';
let OUT = Symbol('out');

let dirs = [ [0,-1], [0,1], [1,0], [-1,0] ];

let parse = (data,len=1024) => {
  let lines = data.split('\n');
  let xmin = 0,ymin=0;
  let xmax,ymax;
  if (lines.length >= 1024) {
    // full input
    xmax = 71;
    ymax = 71;
  } else {
    len = 12;
    xmax = 7;
    ymax = 7;
  }
  let grid = {};
  for (let i = 0; i < len; i++) {
    let [x,y] = toInts(lines[i]);
    grid[ [x,y] ] = BOX;
  }
  let get = ([x,y]) => {
    if (x < xmin || x >= xmax) return OUT;
    if (y < ymin || y >= ymax) return OUT;
    return grid[[x,y]] ?? FREE;
  }
  let next = () => {
    len += 1;
    assert(lines[len]);
    let pos = toInts(lines[len]);
    grid[ pos ] = BOX;
    return pos;
  }
  return {grid,get,goal:[xmax-1,ymax-1], next};
}

let vecadd = (v1,v2) => {
  assert(v1.length === v2.length);
  return v1.reduce((acc,v,idx) => {
    acc.push(v + v2[idx]);
    return acc;
  }, []);
}
let veceq = (v1,v2) => {
  assert(v1.length === v2.length);
  return v1.reduce((isEq,_,idx) => isEq && v1[idx] === v2[idx], true);
}
assert(veceq([1,2],[1,2]));
assert(!veceq([1,2],[1,1]));
let vecmul = (v1,mul) => v1.map(v => v*mul);
let sum = arr => arr.reduce((acc,v) => acc + v,0);
let manhattanDistance = (v1,v2) => {
  assert(v1.length === v2.length);
  return sum(vecadd(vecmul(v1,-1),v2).map(Math.abs));
}
let md = manhattanDistance;
assert(md([0,0],[5,0]) === 5);
assert(md([0,0],[-5,0]) === 5);
assert(md([1,0],[5,1]) === 5);
assert(md([5,0],[0,1]) === 6);
assert(md([2,1],[1,2]) === 2);
let solve = puzzle => {
  let { grid, get, goal } = puzzle;
  let hash = JSON.stringify;
  let start = [0,0];
  let best = new Map();
  let initState = {pos:start,steps:0};
  let stack = [initState];
  while (stack.length) {
    let state = stack.pop();
    let key = hash(state.pos);
    if (best.has(key)) {
      let bestLen = best.get(key);
      if (state.steps >= bestLen) continue;
    }
    best.set(key, state.steps);
    if (veceq(state.pos, goal)) {
      console.log('got to goal in',state.steps);
      continue;
    }
    let next = dirs.map(d => {
      return {pos: vecadd(d,state.pos), steps: state.steps + 1};
    }).filter(({pos}) => get(pos) === FREE);
    stack.push(...next);
  }
  return best.get(hash(goal));
}
let reachable = (start,end,puzzle) => {
  let {get} = puzzle;
  let initState = {pos:start, cost: md(start,end)};
  let seen = new Set();
  let hash = JSON.stringify;
  let queue = new TinyQueue([initState], (a,b) => a.cost - b.cost);
  while (queue.length) {
    let state = queue.pop();
    let key = hash(state.pos);
    if (seen.has(key)) continue;
    seen.add(key);
    if (veceq(state.pos,end)) return true;
    let next = dirs.map(d => vecadd(d,state.pos)).filter(newpos => get(newpos) === FREE).map(newpos => {
      return {pos:newpos, cost:md(newpos,end)}
    }).sort((a,b) => a.cost - b.cost);
    next.forEach(n => queue.push(n));
  }
  return false;
}
let solve2 = puzzle => {
  let {goal} = puzzle;
  let start = [0,0];
  let block;
  while (reachable(start,goal,puzzle)) {
    block = puzzle.next();
    console.log('checking',block);
  }
  return block;
}

/*

0,0 1
1,0 2
1,1 3

OO.#OOO
.O#OO#O
.OOO#OO
...#OO#
..#OO#.
.#.O#..
#.#OOOO

*/

// 4831 too high
// 4761 too high
// 4737 ??
// 141 too low
// 315 wrong
// let p1 = solve(parse(data));
// console.log({p1});
debugger;
let p2 = solve2(parse(data));
console.log({p2});
