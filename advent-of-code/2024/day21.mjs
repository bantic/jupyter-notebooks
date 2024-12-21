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
let MOVES = {
  '>': [1,0],
  '<': [-1,0],
  '^': [0,-1],
  'v': [0,1]
};
let npadGrid = [
  "789".split(''),
  "456".split(''),
  "123".split(''),
  [OUT,'0','A']
];
npadGrid.get = ([x,y]) => npadGrid[y]?.[x] ?? OUT;
let dpadGrid = [
  [OUT, '^','A'],
  ['<','v','>']
];
dpadGrid.get = ([x,y]) => dpadGrid[y]?.[x] ?? OUT;

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

// let dpad2 = makeDpad();
// dpad2.setName('dpad2');
// let dpad1 = makeDpad(dpad2);
// let npad = makeNpad(dpad1);
// npad.enter('029A');
// console.log(npad.state.moves.join(''));
// console.log(npad.state.moves.join('') === '<A^A>^^AvvvA');
// console.log(dpad1.state.moves.join(''));
// console.log('v<<A>>^A<A>AvA<^AA>A<vAAA>^A');
// console.log(dpad2.state.moves.join(''));
// console.log('<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A');

let npadBtn2Pos = npadGrid.reduce((map,row,y) => {
  row.forEach((v,x) => {
    map[v] = [x,y];
  });
  return map;
}, {});
let dpadBtn2Pos = dpadGrid.reduce((map,row,y) => {
  row.forEach((v,x) => {
    map[v] = [x,y];
  });
  return map;
}, {});
let getPaths = (startPos,endPos, grid) => {
  if (veceq(startPos,endPos)) { return [[]]; }
  let dx = endPos[0] - startPos[0];
  let dy = endPos[1] - startPos[1];
  let moves = [
    ...[ dx > 0 ? '>' : dx === 0 ? null : '<' ].filter(Boolean),
    ...[ dy > 0 ? 'v' : dy === 0 ? null : '^' ].filter(Boolean),
  ];
  let movesWithPos = moves.map(move => {
    return [move, vecadd(startPos, MOVES[move])];
  });
  let validMovesWithPos = movesWithPos.filter(([move,pos]) => grid.get(pos) !== OUT);
  let retval = validMovesWithPos.flatMap(([move,pos]) => {
    return getPaths(pos,endPos,grid).map(endPath => [move,...endPath]);
  });
  return retval;
}
let npaths = (startBtn,endBtn) => getPaths(npadBtn2Pos[startBtn],npadBtn2Pos[endBtn],npadGrid);
let dpaths = (startBtn,endBtn) => getPaths(dpadBtn2Pos[startBtn],dpadBtn2Pos[endBtn],dpadGrid);

let getSeqPaths = (seq, prev='A', paths=[[]]) => {
  if (seq.length === 0) return paths;
  let next = seq[0];
  let nextPaths = dpaths(prev,next);
  let newPaths = [];
  for (let path of paths) {
    for (let nextPath of nextPaths) {
      let newPath = [...path,...nextPath, 'A'];
      newPaths.push(newPath);
    }
  }
  return getSeqPaths(seq.slice(1), next, newPaths);
}

console.log(getSeqPaths('<A'.split('')));
console.log(getSeqPaths('v<<A>>^A'.split('')).map(s => s.join('')));
console.log('<vA<AA>>^AvAA<^A>A<');
let bestDseqLen = (seq, depth=0) => {
  let seqs = getSeqPaths(seq);
  let l = seqs[0].length;
  assert(seqs.every(s => s.length === l));
  if (depth === 0) {
    return seqs[0].length;
  }
  return Math.min(
    ...seqs.map(seq => bestDseqLen(seq,depth-1))
  );
};

let solve = (code, depth=1) => {
  let curBtn = 'A';
  let bestLen = 0;
  for (let btn of code.split('')) {
    let seqs = npaths(curBtn,btn).map(path => [...path,'A']);
    bestLen += Math.min(
      ...seqs.map(s => bestDseqLen(s,1)
    ));
    curBtn = btn;
  }
  return bestLen;
}

let sols = `
029A: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
980A: <v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A
179A: <v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
456A: <v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A
379A: <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
`.trim();

let complexity = code => {
  let len = solve(code);
  let num = parseInt(code.match(/\d+/)[0], 10);
  return num * len;
}

let comp = 0;
for (let s of sols.split('\n')) {
  let [code,seq] = s.split(': ');
  console.log(`${code}: (${seq.length}): ${seq}`);

  console.log(solve(code), complexity(code));
  comp += complexity(code);
}
console.log('total comp:',comp);

comp = 0;
for (let code of data.split('\n')) {
  console.log(`${code}: ${solve(code)}`);
  comp += complexity(code);
}

let solvep1 = data => {
  let comp = 0;
  for (let code of data.split('\n')) {
    console.log(`${code}: ${solve(code, 1)}`);
    comp += complexity(code);
  }
  return comp;
}

console.log({p1: solvep1(data)});
