import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day21.txt", "utf8").trim();

let testdata = `
029A
980A
179A
456A
379A`.trim();

let MOVES = {
  '>': [1,0],
  '<': [-1,0],
  '^': [0,-1],
  'v': [0,1]
};
let OUT = Symbol();
let NPAD_GRID = [
  "789".split(''),
  "456".split(''),
  "123".split(''),
  [OUT,'0','A']
];
NPAD_GRID.get = ([x,y]) => NPAD_GRID[y]?.[x] ?? OUT;
let DPAD_GRID = [
  [OUT, '^','A'],
  ['<','v','>']
];
DPAD_GRID.get = ([x,y]) => DPAD_GRID[y]?.[x] ?? OUT;

let getPos = (grid,btn) => {
  let y = grid.findIndex(row => row.includes(btn));
  let x = grid[y].indexOf(btn);
  return [x,y];
}
let veceq = (v1,v2) => v1.length === v2.length && v1.every((v,idx) => v === v2[idx]);
let vecadd = (v1,v2) => {
  assert(v1.length === v2.length);
  return v1.map((_,idx) => v1[idx]+v2[idx]);
};
let vecmul = (v1,mul) => v1.map(v => v*mul);
let sum = arr => arr.reduce((acc,m) => acc+m,0);
let md = (v1,v2) => {
  assert(v1.length === v2.length);
  return sum(vecadd(vecmul(v1,-1),v2).map(Math.abs));
}
let uniq = arr => Array.from(new Set(arr));
let reverseStr = str => str.split('').toReversed().join('');
let sortStr = str => str.split('').toSorted().join('');
let getPaths = (startBtn,endBtn,grid) => {
  if (startBtn === endBtn) return [''];
  let startPos = getPos(grid,startBtn);
  let endPos = getPos(grid,endBtn);

  let validMoves = (p1,p2) => {
    let dist = md(p1,p2);
    return Object.entries(MOVES).filter(([move,dir]) => {
      let next = vecadd(p1,dir);
      return grid.get(next) !== OUT && md(next,p2) < dist;
    }).map(([move,_dir]) => move);
  }

  let moves = validMoves(startPos,endPos);
  let paths = moves.flatMap(move => {
    let nextStart = vecadd(startPos,MOVES[move]);
    return getPaths(grid.get(nextStart),endBtn,grid).map(path => move + path);
  });
  return paths;
  // this was apparently skipping something...
  // return uniq(uniq(paths.map(p => sortStr(p))).flatMap(p => [p,reverseStr(p)]));
}
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
let getNPaths = (startBtn,endBtn) => getPaths(startBtn,endBtn,NPAD_GRID);
getNPaths = memoize(getNPaths);
let getDPaths = (startBtn,endBtn) => getPaths(startBtn,endBtn,DPAD_GRID);
getDPaths = memoize(getDPaths);

// for (let pair of ['A0','A2','A5','A7','25','20','62','26']) {
//   let [a,b] = pair.split('');
//   console.log(pair, getNPaths(a,b));
// }

// for (let pair of ['A<','A^','A>','Av','vA','<>','^v','<^']) {
//   let [a,b] = pair.split('');
//   console.log(pair, getDPaths(a,b));
// }

let getAllPaths = (dseq, idx=0, prev='A', curPath=[], paths=[]) => {
  if (idx === dseq.length) {
    paths.push(curPath);
    return paths;
  }
  let next = dseq[idx];
  for (let nextPath of getDPaths(prev, next)) {
    getAllPaths(dseq, idx+1, next, curPath + nextPath + 'A', paths);
  }
  return paths;
}

// console.log(getAllPaths('<A'));
// console.log(getAllPaths('v<<A>>^A<AAvA<^AA>A<vAAA>^A'));
// console.log(new Set(getAllPaths('v<<A>>^A<A>AvA<^AA>A<vAAA>^A').map(v => v.length)));

let groupsByEnd = (str,end='A') => {
  let groups = [];
  let curGroup = [];
  let arr = str.split('');
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === end) {
      curGroup.push(arr[i]);
      groups.push(curGroup);
      curGroup = [];
    } else {
      curGroup.push(arr[i]);
    }
  }
  return groups.map(g => g.join(''));
}

let solveSeq = (seq,depth) => {
  if (depth === 0) return seq.length;
  let total = 0;
  for (let group of groupsByEnd(seq,'A')) {
    let seqs = getAllPaths(group);
    let min = Math.min(
      ...seqs.map(s => solveSeq(s,depth-1))
    );
    total += min;
  }
  return total;
}
solveSeq = memoize(solveSeq);

let pairs = str => {
  let ps = [];
  let arr = str.split('');
  for (let i = 1; i < arr.length; i++) {
    ps.push([arr[i-1],arr[i]]);
  }
  return ps;
}
let solveCode = (code,depth) => {
  let total = 0;
  for (let pair of pairs('A' + code)) {
    let npaths = getNPaths(...pair).map(p => p + 'A');
    let min = Math.min(
      ...npaths.map(path => solveSeq(path,depth))
    );
    total += min;
  }
  return total;
}

for (let args of [
  ['<A',0],
  ['<A',1],
  ['<A',24],
  ['v<<A',1],
  ['>>^A',1],
  ['^A',2]
]) {
  console.log(args, solveSeq(...args));
}

for (let code of [
  '029A',
  '980A',
  '179A',
  '456A',
  '379A'
]) {
  console.log(code, solveCode(code,2));
}

let solve = (codes,depth=2) => {
  let total = 0;
  for (let code of codes) {
    let num = parseInt(code.match(/\d+/)[0], 10);
    let v = solveCode(code,depth);
    console.log(code,num,v);
    total += num*v;
  }
  return total;
}

let p1 = solve(data.split('\n'), 2);
console.log({p1});
let p2 = solve(data.split('\n'), 25);
console.log({p2});
