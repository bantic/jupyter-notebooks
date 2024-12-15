fs = require("node:fs");
assert = require('node:assert');
data = fs.readFileSync("./data/day15-test.txt", "utf8").trim();
data = fs.readFileSync("./data/day15.txt", "utf8").trim();

dirs = {
  '^': [0,-1],
  'v': [0,1],
  '>': [1,0],
  '<': [-1,0],
}
WALL = '#'
BOX = 'O'
SPACE = '.'
BOT = '@'


parse = data => {
  let grid = [];
  let moves = [];
  for (let line of data.split('\n')) {
    if (line === '') { continue; }
    if (Object.keys(dirs).some(d => line.includes(d))) {
      moves.push(...line);
    }
    if ([WALL,BOX,SPACE,BOT].some(i => line.includes(i))) {
      grid.push(line.split(''));
    }
  }
  let initY = grid.findIndex((l) => l.includes(BOT));
  let initX = grid[initY].indexOf(BOT);
  let start = [initX,initY];
  return [grid,moves,start];
}

print = grid => {
  console.log(grid.map(l => l.join('')).join('\n'));
}

move = (pos,dir) => [pos[0] + dir[0], pos[1] + dir[1]];

extend = (grid, pos, dir) => {
  let nextPos = move(pos,dir);
  let nextV = get(grid,nextPos);
  if (nextV === SPACE) {
    return [pos,nextPos];
  }
  if (nextV === WALL) {
    return [pos];
  }
  if (nextV === BOX) {
    let boxes = [];
    while (get(grid,nextPos) === BOX) {
      boxes.push(nextPos);
      nextPos = move(nextPos, dir);
    }
    if (get(grid,nextPos) === SPACE) {
      return [
        pos, ...boxes, nextPos
      ];
    } else {
      assert(get(grid,nextPos) === WALL);
      return [pos];
    }
  }
}

get = (grid,pos) => {
  let v = grid[pos[1]][pos[0]];
  assert(v !== undefined);
  return v;
}
set = (grid,pos,v) => {
  let oldV = get(grid,pos);
  // assert(oldV !== v);
  grid[pos[1]][pos[0]] = v;
}

next = state => {
  let [grid,moves,pos] = state;
  assert(get(grid,pos) === BOT);
  let move = moves.shift();
  let dir = dirs[move];
  let spots = extend(grid, pos, dir);
  let nextPos;
  if (spots.length > 1) {
    nextPos = spots[1];
    let spotVs = spots.map(p => get(grid,p));
    assert(spotVs.at(-1) === SPACE);
    assert(spotVs[0] === BOT);
    spotVs.unshift(SPACE);
    spotVs.pop();
    for (let i = 0; i < spots.length; i++) {
      set(grid, spots[i], spotVs[i]);
    }
    // console.log(`Move: ${move}`);
  } else {
    nextPos = spots[0];
  }
  return [grid,moves, nextPos];
}

let state = parse(data);
print(state[0]);
let i = 0;
while (state[1].length) {
  i++;
  console.log(i);
  state = next(state);
}
score = grid => {
  let sum = 0;
  let minX = 0, minY = 0, maxY = grid.length, maxX = grid[0].length;
  for (let x = minX; x < maxX; x++) {
    for (let y = minY; y < maxY; y++) {
      if (get(grid,[x,y]) === BOX) {
        sum += 100*y+x;
      }
    }
  }
  return sum;
}
print(state[0]);
console.log(score(state[0]));
