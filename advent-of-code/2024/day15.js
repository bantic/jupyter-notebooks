fs = require("node:fs");
assert = require('node:assert');
data = fs.readFileSync("./data/day15-test.txt", "utf8").trim();
data = fs.readFileSync("./data/day15.txt", "utf8").trim();
// testdata = `
// #######
// #...#.#
// #.....#
// #..OO@#
// #..O..#
// #.....#
// #######

// <vv<<^^<<^^
// `.trim();
// data = testdata;

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

let score = grid => {
  let sum = 0;
  let minX = 0, minY = 0, maxY = grid.length, maxX = grid[0].length;
  for (let x = minX; x < maxX; x++) {
    for (let y = minY; y < maxY; y++) {
      if ([BOX,BOXL].includes(get(grid,[x,y]))) {
        sum += 100*y+x;
      }
    }
  }
  return sum;
}

// let state = parse(data);
// print(state[0]);
// let i = 0;
// while (state[1].length) {
//   i++;
//   console.log(i);
//   state = next(state);
// }
// print(state[0]);
// console.log(score(state[0]));

BOXL = '[';
BOXR = ']';
p2charmap = {
  [BOX]: [BOXL,BOXR],
  [WALL]: [WALL,WALL],
  [BOT]: [BOT,SPACE],
  [SPACE]: [SPACE,SPACE]
}
parse2 = data => {
  let moves = [];
  let grid = [];
  data.split('\n').forEach((line,y) => {
    if (Object.keys(dirs).some(d => line.includes(d))) {
      moves.push(...line.split(''));
    } else if (line === '') {
      return;
    } else {
      grid[y] = [];
      line.split('').forEach((c) => {
        if (!p2charmap[c]) {
          console.log('C',c);
        }
        grid[y].push(...p2charmap[c]);
      })
    }
  });

  let posY = grid.findIndex(l => l.includes(BOT));
  let posX = grid[posY].indexOf(BOT);

  return [grid,moves,[posX,posY]];
}

moveLeft = '<';
moveRight = '>';
moveUp = '^';
moveDown = 'v';
horizMoves = [moveLeft,moveRight];
vertMoves = [moveUp,moveDown];

let moveDir = (pos,move) => {
  let dir = dirs[move];
  assert(!!dir);
  return [pos[0] + dir[0],pos[1]+dir[1]];
}

checkMove = (grid,move,pos) => {
  if (horizMoves.includes(move)) {
    return checkHorizMove(grid,move,pos);
  } else {
    assert(vertMoves.includes(move));
    return checkVertMove(grid,move,pos);
  }
}
checkHorizMove = (grid,move,pos) => {
  let toMove = [pos];
  let nextPos = moveDir(pos,move);
  while (true) {
    toMove.push(nextPos);
    if ([SPACE,WALL].includes(get(grid,nextPos))) {
      break;
    }
    nextPos = moveDir(nextPos,move);
  }
  let lastV = get(grid,toMove.pop());
  if (lastV === WALL) {
    return [false];
  } else {
    assert(lastV === SPACE);
    return [true, toMove];
  }
}
toPairs = arr => {
  assert(arr.length % 2 === 0);
  let pairs = [];
  for (let i = 0; i < arr.length; i += 2) {
    pairs.push( [arr[i],arr[i+1] ]);
  }
  return pairs;
}
checkVertMove = (grid,move,pos) => {
  let toMove = [pos];
  let nextPos = moveDir(pos,move);

  // easy: space/wall adjoining
  if ([WALL,SPACE].includes(get(grid,nextPos))) {
    return [SPACE === get(grid,nextPos), [pos]];
  }

  assert([BOXL,BOXR].includes(get(grid,nextPos)));
  let toMoveCurLevel = [pos];
  while (true) {
    let toMoveNextLevel = toMoveCurLevel.map(pos => moveDir(pos,move));
    if (toMoveNextLevel.some(pos => get(grid,pos) === WALL)) {
      return [false];
    }
    toMoveNextLevel = toMoveNextLevel.filter(p => [BOXL,BOXR].includes(get(grid,p)));
    if (toMoveNextLevel.length === 0) {
      // all spaces
      break;
    }
    toMoveNextLevel = collectAtLevel(grid, toMoveNextLevel);
    toMove.push(toMoveNextLevel);
    toMoveCurLevel = toMoveNextLevel;
  }
  return [true, toPairs(toMove.flat(Infinity))];
}
// complete partial boxes on this y-level
collectAtLevel = (grid,pos_s) => {
  assert(new Set(pos_s.map(([x,y]) => y)).size === 1); // all same level
  return pos_s.flatMap(pos => {
    let v = get(grid,pos);
    assert([BOXL,BOXR].includes(v));
    let other = v === BOXL ? moveDir(pos, moveRight) : moveDir(pos, moveLeft);
    assert(['[]',']['].includes(`${v}${get(grid,other)}`));
    return [pos,other];
  });
}

toInt = v => parseInt(v);
shiftGrid = (grid, toMovePos_s, move) => {
  let nexts = {};
  for (let i = 0; i < toMovePos_s.length; i++) {
    let p = toMovePos_s[i];
    if (i === 0) { assert(get(grid,p) === BOT); }
    nexts[p] ??= SPACE;
    nexts[moveDir(p,move)] ??= get(grid,p);
  }
  for (let [pos_str,v] of Object.entries(nexts)) {
    let [x,y] = pos_str.split(',').map(toInt);
    grid[y][x] = v;
  }
  return grid;
}

next2 = state => {
  let [grid,moves,pos] = state;
  assert(get(grid,pos) === BOT);
  let move = moves.shift();
  console.log(`Move: ${move}`);
  let [canMove, toMovePos_s] = checkMove(grid,move,pos);
  if (!canMove) { return [grid,moves,pos]; }

  grid = shiftGrid(grid, toMovePos_s, move);
  return [grid,moves,moveDir(pos,move)];
}

let state = parse2(data);
print(state[0]);
console.log(state[1].length,state[2]);
while (state[1].length) {
  state = next2(state);
  print(state[0]);
}
console.log(score(state[0]))
