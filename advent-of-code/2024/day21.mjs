import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day21.txt", "utf8").trim();

let OUT = Symbol();
let codes = data.split('\n');
let vecadd = (v1,v2) => {
  assert(v1.length === v2.length);
  return v1.map((_,idx) => v1[idx]+v2[idx]);
};
let veceq = (v1,v2) => v1.length === v2.length && v1.every((v,idx) => v === v2[idx]);
let vecmul = (v1,mul) => v1.map(v => v*mul);
let sum = arr => arr.reduce((acc,m) => acc+m,0);
let manhattanDistance = (v1,v2) => {
  assert(v1.length === v2.length);
  return sum(vecadd(vecmul(v1,-1),v2).map(Math.abs));
}
let md = manhattanDistance;
let moves = {
  '>': [1,0],
  '<': [-1,0],
  '^': [0,-1],
  'v': [0,1]
};
let n4 = p => DIRS.map(d => vecadd(d,p));
let npadGrid = [
  "789".split(''),
  "456".split(''),
  "123".split(''),
  [OUT,'0','A']
];
let dpadGrid = [
  [OUT, '^','A'],
  ['<','v','>']
];
let makePad = (grid, controller=null) => {
  let name;
  let keymap = grid.reduce((map,row,y) => {
    row.forEach((v,x) => {
      map[v] = [x,y];
    });
    return map;
  }, {});
  let state = {cur:'A', moves:[]};
  let get = p => grid[p[1]]?.[p[0]] ?? OUT;
  let getPaths = (start,end) => {
    if (veceq(start,end)) return [];
    let closer = n4(start)
  }
  let moveTo = btn => {
    let cur = keymap[state.cur];
    let end = keymap[btn];
    // get all paths, then check the controller for its best path
    while (!veceq(cur,end)) {
      let xmove = cur[0] === end[0] ? null : cur[0] < end[0] ? '>' : '<';
      let ymove = cur[1] === end[1] ? null : cur[1] < end[1] ? 'v' : '^';
      let possMoves = [xmove,ymove]
        .filter(Boolean)
        .filter(m => get(vecadd(cur,moves[m])) !== OUT);
      assert(possMoves.length > 0);
      let move = possMoves[0];
      controller?.enter([move]);
      state.moves.push(move);
      cur = vecadd(cur,moves[move]);
    }
    state.cur = get(cur);
    assert(state.cur === btn);
  }
  let press = () => {
    controller?.enter(['A']);
    state.moves.push('A');
  }
  let enter = code => {
    if (name === 'dpad2') debugger;
    for (let btn of code) {
      moveTo(btn);
      press();
    }
  }

  return { state, enter, setName: (n) => name = n };
}
let makeNpad = (controller) => makePad(npadGrid, controller);
let makeDpad = (controller) => makePad(dpadGrid, controller);

let dpad2 = makeDpad();
dpad2.setName('dpad2');
let dpad1 = makeDpad(dpad2);
let npad = makeNpad(dpad1);
npad.enter('029A');
console.log(npad.state.moves.join(''));
console.log(npad.state.moves.join('') === '<A^A>^^AvvvA');
console.log(dpad1.state.moves.join(''));
console.log('v<<A>>^A<A>AvA<^AA>A<vAAA>^A');

console.log(dpad2.state.moves.join(''));
console.log('<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A');
