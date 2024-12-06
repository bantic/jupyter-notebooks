import fs from "node:fs";
let data = fs.readFileSync("day6.txt", { encoding: "utf8" }).trim();
let grid = data.split("\n").map((l) => l.split(""));
let OUT = Symbol("out");
let IS_LOOP = Symbol("loop");
let GUARD = "^";
let WALL = "#";
let get = ([x, y]) => grid[y]?.[x] || OUT;
let assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
let U = [0, -1],
  R = [1, 0],
  D = [0, 1],
  L = [-1, 0];
let DIRS = [U, R, D, L].map((d, idx) => [...d, idx]);
let turn = (dir) => DIRS[(dir[2] + 1) % DIRS.length];
let move = ([x, y], [dx, dy]) => [x + dx, y + dy];
let next = (state) => {
  let { pos, dir } = state;
  let nextPos = move(pos, dir);
  if (get(nextPos) === WALL) {
    return { pos, dir: turn(dir) };
  } else {
    return { pos: nextPos, dir };
  }
};
let hashState = (state) => {
  let {
    pos: [x, y],
    dir: [, , dirIdx],
  } = state;
  return [x, y, dirIdx].join(",");
};

let initState = () => {
  let initY = grid.findIndex((l) => l.includes(GUARD));
  let initX = grid[initY].indexOf(GUARD);
  return { pos: [initX, initY], dir: DIRS[0] };
};

// follow until loop detected or OUT
let follow = (state = initState()) => {
  let states = [];
  let uniqueStates = new Set();
  while (true) {
    if (get(state.pos) === OUT) {
      break;
    }
    let key = hashState(state);
    if (uniqueStates.has(key)) {
      return IS_LOOP;
    } else {
      uniqueStates.add(key);
    }
    states.push(state);
    state = next(state);
  }
  return states;
};

let uniquePositions = new Set(follow().map(({ pos }) => pos.join(",")));
let p1 = uniquePositions.size;

let walls = new Set();
for (let x = 0; x < grid[0].length; x++) {
  for (let y = 0; y < grid.length; y++) {
    let wall = [x, y];
    if ([WALL, GUARD].includes(get(wall))) {
      continue;
    }

    let orig = grid[y][x];
    grid[y][x] = WALL;
    if (follow() === IS_LOOP) {
      walls.add(wall.join(","));
    }
    grid[y][x] = orig;
  }
}

let p2 = walls.size;

console.log({ p1, p2 });
