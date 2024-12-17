fs = require("node:fs");
assert = require('node:assert');
data = fs.readFileSync("./data/day17.txt", "utf8").trim();
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

testData = `Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0`.trim();

let p1 = runAll(parse(data)).out.join(',');
console.log({p1})
