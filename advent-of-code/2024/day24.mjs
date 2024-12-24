import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day24.txt", "utf8").trim();

let OPS = {
  'AND': (a,b) => () => {
    assert(S_MAP.has(a));
    assert(S_MAP.has(b));
    return S(a).get() & S(b).get();
  },
  'OR': (a,b) => () => {
    assert(S_MAP.has(a));
    assert(S_MAP.has(b));
    return S(a).get() | S(b).get();
  },
  'XOR': (a,b) => () => {
    assert(S_MAP.has(a));
    assert(S_MAP.has(b));
    return S(a).get() ^ S(b).get();
  }
};

class Signal {
  constructor(id) {
    this.id = id;
  }
  set(fnOrV) {
    if (typeof fnOrV === 'function') {
      this.fn = fnOrV;
    } else {
      // value
      this.fn = () => fnOrV;
    }
  }
  get() {
    return this.fn();
  }
}

let S_MAP = new Map();
let S = (wire, fnOrV) => {
  if (!S_MAP.has(wire)) S_MAP.set(wire, new Signal(wire));
  let s = S_MAP.get(wire);
  if (fnOrV !== undefined) { s.set(fnOrV); }
  return s;
}

let parse = data => {
  let wires = new Set();
  let [ins,circuits] = data.split('\n\n');
  ins.split('\n').forEach(l => {
    let [wire,v] = l.split(': ');
    v = parseInt(v);
    wires.add(wire);
    S(wire, v);
  });
  circuits.split('\n').forEach(l => {
    let [in1,in2,out] = [...l.matchAll(/[a-z0-9]+/g)].map(m => m[0]);
    wires.add(in1);
    wires.add(in2);
    wires.add(out);
    let op = l.match(/[A-Z]+/)[0];
    assert(!!OPS[op]);
    S(out, OPS[op](in1,in2));
  });
  return wires;
}

let solve = data => {
  let wires = parse(data);
  let zs = Array.from(wires).filter(w => w.startsWith('z'));
  zs = zs.toSorted((a,b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  let bits = zs.map(z => {
    return [z, parseInt(z.slice(1)), S(z).get()];
  });
  return bits.reduce((p1, [wire,num,bit]) => {
    p1 += bit * Math.pow(2,num);
    return p1;
  }, 0);
}



let p1 = solve(data);
console.log({p1});
