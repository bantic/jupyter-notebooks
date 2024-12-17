fs = require("node:fs");
assert = require('node:assert');
data = fs.readFileSync("./data/day17.txt", "utf8").trim();

testdata = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`.trim();

// data = testdata;

toInt = v => parseInt(v);
toInts = str => Array.from(str.matchAll(/\d+/g)).map(toInt);
parse = data => {
  return data.split('\n').reduce((state,line) => {
    if (line.includes('A')) {
      state.A = toInts(line)[0];
    }
    if (line.includes('B')) {
      state.B = toInts(line)[0];
    }
    if (line.includes('C')) {
      state.C = toInts(line)[0];
    }
    if (line.includes('Program')) {
      state.prog = toInts(line);
    }
    return state;
  }, {ip: 0, out:[]});
}

runAll = state => {
  while (state.ip >= 0 && state.ip < state.prog.length) {
    state = runOne(state);
  }
  return state;
}

mod8 = v => {
  assert(v >= 0);
  return v % 8;
}
combo = (state,operand) => {
  assert(operand >= 0 && operand < 8);
  assert(operand !== 7); // reserved
  switch (operand) {
    case 4: return state.A;
    case 5: return state.B;
    case 6: return state.C;
    case 7: return;
    default: return operand;
  }
}
DV = (state,operand,target) => {
  state[target] = Math.trunc(state.A / Math.pow(2, combo(state,operand)));
  state.ip += 2;
  return state;
}
ADV = (state,operand) => {
  return DV(state,operand,'A');
}
BXL = (state,operand) => {
  state.B = state.B ^ operand;
  state.ip += 2;
  return state;
}
BST = (state, operand) => {
  state.B = mod8(combo(state,operand));
  state.ip += 2;
  return state;
}
JNZ = (state, operand) => {
  if (state.A === 0) {
    state.ip += 2;
  } else {
    state.ip = operand;
  }
  return state;
}
BXC = (state) => {
  state.B = state.B ^ state.C;
  state.ip += 2;
  return state;
}
OUT = (state,operand) => {
  state.out.push(mod8(combo(state,operand)));
  state.ip += 2;
  return state;
}
BDV = (state,operand) => {
  return DV(state,operand,'B');
}
CDV = (state,operand) => {
  return DV(state,operand,'C');
}
OPS = {
  0: ADV,
  1: BXL,
  2: BST,
  3: JNZ,
  4: BXC,
  5: OUT,
  6: BDV,
  7: CDV,
}

runOne = state => {
  let {ip,prog} = state;
  assert(ip >= 0 && ip < prog.length - 1);
  let op = OPS[prog[ip]];
  assert(!!op);
  let operand = prog[ip+1];
  return op(state,operand);
}

let p1 = runAll(parse(data)).out.join(',');
console.log({p1})


isEq = (arr1,arr2) => {
  return arr1.length === arr2.length && isPrefixEq(arr1,arr2);
}
isPrefixEq = (arr1,arr2) => {
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}
assert(isEq([1,2,3],[1,2,3]));
assert(isEq([],[]));
assert(isPrefixEq([],[]));
assert(isPrefixEq([],[1,2,3]));
assert(isPrefixEq([1],[1,2,3]));

let state = parse(data);
let p2 = 105734774294938;
state.A = p2;
let end = runAll(state);
console.log(end);
assert(isEq(end.out,state.prog));
console.log({p2});

// This attempt did not go anywhere:
solvep2 = (initState,targetOut) => {
  let MAX_ITERS = 50;

  let {B,C,prog} = initState;
  makeState = guess => {
    return {
      A: guess,
      B,
      C,
      prog,
      out: [],
      ip: 0
    };
  }

  let guess = -1;
  // let guess = 20443186 - 1;
  // let guess = 142246040 - 1;
  // let guess = 638000000 - 1;
  // guess = 1821000000 - 1;
  // guess = 2388743321 - 1;
  // guess = 2647743320 - 1;
  // guess = 2783614233 - 1;
  // guess = 1021136002000000-1;
  // guess = 62217;
  guess = 37259674 - 1;
  let bestLen = 0;
  let bestLenIncorrect = 0;
  let seenmod8 = {};
  let idx = 0;
  while (true) {
    guess++;
    idx++;
    // if (![0,1,2,3,6].includes(guess % 8)) continue;
    // if (![1,2].includes(guess % 8)) continue;
    if (idx % 1_000_000 === 0) console.log(`Guess: ${guess}`);
    let state = makeState(guess);
    while (isPrefixEq(state.out, targetOut) && !isEq(state.out,targetOut)) {
      let iters = 0;
      let flag = false;
      let len = state.out.length;
      while (iters < MAX_ITERS && len === state.out.length) {
        iters++;
        try {
          state = runOne(state);
        } catch {
          flag = true;
          break;
        }
      }
      if (iters === MAX_ITERS) {
        console.log('max iters');
        break;
      }
      if (flag) break;
      for (let i = 0; i < state.out.length; i++) {
        if (state.out[i] === state.prog[i]) {
          seenmod8[i] ??= new Set();
          let had = seenmod8[i].has(guess % 8);
          seenmod8[i].add(guess % 8);
          if (!had) {
            console.log('seenmod8',seenmod8);
          }
        }
      }
      if (isPrefixEq(state.out,prog) && state.out.length > bestLen) {
        bestLen = state.out.length;
        console.log(`Guess ${guess}: ${state.out.join(',')}`);
      }
    }
    if (isEq(state.out,targetOut)) {
      return guess;
    }
  }
}

// let p2 = solvep2(parse(data),parse(data).prog);
// console.log({p2});
