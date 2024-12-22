import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day21.txt", "utf8").trim();

let testdata = `029A
980A
179A
456A
379A`.trim();

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
let memoize = (fn) => {
  let hash = JSON.stringify;
  let cache = new Map();
  return (...args) => {
    let key = hash(args);
    if (!cache.has(key)) {
      cache.set(key, fn(...args));
    }
    return cache.get(key);
  };
};

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
  let moves = [];
  if (dy > 0) moves.push('v');
  if (dx > 0) moves.push('>');
  if (dy < 0) moves.push('^');
  if (dx < 0) moves.push('<');
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
npaths = memoize(npaths);
let dpaths = (startBtn,endBtn) => getPaths(dpadBtn2Pos[startBtn],dpadBtn2Pos[endBtn],dpadGrid);
dpaths = memoize(dpaths);

let getBestNPath = (startBtn,endBtn) => npaths(startBtn,endBtn)[0];

/*

    +---+---+
    | ^ | A |
+---+---+---+
| < | v | > |
+---+---+---+

*/

let getBestDPath = (startBtn,endBtn) => {
  if (startBtn === endBtn) { return []; }
  switch (`${startBtn}${endBtn}`) {
    case 'A<': return ['v','<','<'];
    case 'A^': return ['<'];
    case 'Av': return ['v','<'];
    case 'A>': return ['v'];
    case '^A': return ['>'];
    case '^v': return ['v'];
    case '^<': return ['v','<'];
    case '^>': return ['>','v']; // probably best, since > is better than v
    case '<^': return ['>','^'];
    case '<A': return ['>','>','^']; // could exchange last 2?
    case '<v': return ['>'];
    case '<>': return ['>','>'];
    case 'v^': return ['^'];
    case 'vA': return ['>','^']; // could exchange
    case 'v<': return ['<'];
    case 'v>': return ['>'];
    case '>^': return ['^','<'];
    case '>A': return ['^'];
    case '><': return ['<','<'];
    case '>v': return ['<'];
  }
  assert(false);
}

let getBestDPaths = (startBtn,endBtn) => {
  if (startBtn === endBtn) { return []; }
  switch (`${startBtn}${endBtn}`) {
    case 'A<': return [['v','<','<']];
    case 'A^': return [['<']];
    case 'Av': return [['v','<']];
    case 'A>': return [['v']];
    case '^A': return [['>']];
    case '^v': return [['v']];
    case '^<': return [['v','<']];
    case '^>': return [['>','v'],['v','>']]; // probably best, since > is better than v
    case '<^': return [['>','^']];
    case '<A': return [['>','>','^'],['>','^','>']]; // could exchange last 2?
    case '<v': return [['>']];
    case '<>': return [['>','>']];
    case 'v^': return [['^']];
    case 'vA': return [['>','^'],['^','>']]; // could exchange
    case 'v<': return [['<']];
    case 'v>': return [['>']];
    case '>^': return [['^','<']];
    case '>A': return [['^']];
    case '><': return [['<','<']];
    case '>v': return [['<']];
  }
  assert(false);
}


let expand = (dseq,prev='A') => {
  let path = [];
  for (let btn of dseq) {
    path.push(...getBestDPath(prev,btn));
    path.push('A');
    prev = btn;
  }
  return path;
}

let expandMultiple = (dseq,prev='A',paths=[[]]) => {
  if (dseq.length === 0) return paths;
  let next = dseq[0];
  let nextPaths = getBestDPaths(prev,next);
  let newPaths = [];
  for (let path of paths) {
    for (let nextPath of nextPaths) {
      let newPath = [...path,...nextPath, 'A'];
      newPaths.push(newPath);
    }
  }
  return expandMultiple(dseq.slice(1),next,newPaths);
}

function getSeqPaths(seq, prev='A', paths=[[]]) {
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
// getSeqPaths = memoize(getSeqPaths);

// let SEEN_DEPTHS = new Set();
let bestDseqLen = (seq, depth=0) => {
  // if (!SEEN_DEPTHS.has(depth)) {
  //   console.log(`seen depth: ${depth}`)
  // }
  // SEEN_DEPTHS.add(depth);
  let seqs = getSeqPaths(seq);
  let l = seqs[0].length;
  assert(seqs.every(s => s.length === l));
  if (depth === 0) { return seqs[0].length; }
  let bestLen = Infinity;
  for (let seq of seqs) {
    let len = bestDseqLen(seq, depth-1);
    if (len < bestLen) {
      bestLen = len;
    } else {
      break;
    }
  }
  return bestLen;
};
// bestDseqLen = memoize(bestDseqLen);

let solve = (code, depth=1) => {
  let curBtn = 'A';
  let bestLen = 0;
  for (let btn of code.split('')) {
    let seqs = npaths(curBtn,btn).map(path => [...path,'A']);
    bestLen += Math.min(
      ...seqs.map(s => bestDseqLen(s,depth))
    );
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

let complexity = (code,depth=1) => {
  let len = solve(code,depth);
  let num = parseInt(code.match(/\d+/)[0], 10);
  return num * len;
}

let solvep1 = data => {
  let comp = 0;
  for (let code of data.split('\n')) {
    comp += complexity(code, 1);
  }
  return comp;
}

// let solvep2 = data => {
//   debugger;
//   let comp = 0;
//   for (let code of data.split('\n')) {
//     console.log('p2',code);
//     comp += complexity(code, 24);
//   }
//   return comp;
// }


console.log({p1: solvep1(data)});

let solveCode_a = (code,depth) => {
  debugger;

  let path = [];
  let prev = 'A';

  for (let btn of code) {
    let segment = [...getBestNPath(prev,btn), 'A'];
    for (let i = 0; i < depth; i++) {
      segment = expand(segment);
    }
    path.push(...segment);
    prev = btn;
  }
  return path;
}

let solvep1_a = data => {
  let comp = 0;
  for (let code of data.split('\n')) {
    let path = solveCode_a(code.split(''), 2);
    let num = parseInt(code.match(/\d+/)[0], 10);
    console.log(code, path.length);
    comp += path.length * num;
  }
  return comp;
}

let p1a = solvep1_a(data);
console.log({p1a});
