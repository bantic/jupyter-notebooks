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

let TRACE = null;

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
    if (TRACE) { TRACE.push(this.id); }
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
  return Array.from(wires);
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

let getV = (prefix, wires) => {
  return wires.filter(w => w.startsWith(prefix)).map(w => [w, parseInt(w.slice(1)), S(w).get()]).reduce((acc,[w,num,bit]) => acc += (bit * Math.pow(2,num)), 0);
}

let p1 = solve(data);
console.log({p1});

let wires = parse(data);
let toBin = (dec,len=46) => dec.toString(2).padStart(len,'0');
console.log(getV('x',wires), toBin(getV('x',wires)));
console.log(getV('y',wires), toBin(getV('y',wires)));
console.log(getV('z',wires), toBin(getV('z',wires)));

let setV = (prefix,wires,decimal) => {
  let b = toBin(decimal);
  let bits = b.split('').toReversed();
  bits.forEach((v,idx) => {
    let wire = wires.find(w => w === `${prefix}${idx.toString().padStart(2,'0')}`);
    S(wire, v);
  });
}
debugger;
console.log(getV('x',wires), toBin(getV('x',wires)));
setV('x',wires,5);
console.log(getV('x',wires), toBin(getV('x',wires)));


for (let i = 0; i < 46; i++) {
  TRACE = [];
  let wire = `z${(i).toString().padStart(2,'0')}`;
  console.log(`== ${wire} ==`);
  S(wire).get();
  console.log('trace len: ',TRACE.length);
}


/**

uniq in z11 relative to z10
candidates = 0 =
"z11"
1 =
"cbj"
2 =
"x11"
3 =
"y11"
4 =
"csm"
5 =
"tgf"
6 =
"stp"

 */

// p2 not correct:
// cbj,csm,gpc,qnm,rfk,stp,tgf,wmn
// also incorrect: cbj,cfk,dmn,hnn,khk,qjj,z18,z35
// cbj,cfk,dmn,gmt,qjj,z07,z18,z35 ?

// qjj and cbj should swap
// z35 and cfk should swap
// z18, dmn should swap
//z07,gmt

'qjj,cbj,z35,cfk,z18,dmn,z07,gmt'.split(',')

// Solved analytically by:
// looking at the output of adding up these numbers:

// set Y to 0
// set X to 35184372088831 (binary: 0111111111111111111111111111111111111111111111)
// sum should be: 
// 0111111111111111111111111111111111111111111111
/// but was:
// 1000000000011111111111111111000000100001111111
//            ^                ^     ^    ^
// so these indices are problematic
// wrote a function to look at the uniq rules for a given z wire
// (look at the trace of that wire, and do a set-difference w/ the trace of the lower-bit wire)
// then look up the content of each of those uniq rules
// and manually inspect for errors, and figure out which should swap to fix the errors

/*

z37:
['z37', 'ncc', 'x37', 'y37', 'cqs', 'dqk', 'vrv']
ncc XOR cqs -> z37
x37 XOR y37 -> ncc
dqk OR vrv -> cqs
kth AND mbw -> dqk
x36 AND y36 -> vrv

z36:
['z36', 'mbw', 'rct', 'cfk', 'kth', 'x36', 'y36']

mbw XOR kth -> z36
x36 XOR y36 -> kth
rct OR cfk -> mbw
qnm XOR rfk -> cfk <-- suspect
y35 AND x35 -> rct

z35:
['z35', 'qnm', 'wmn', 'gpc', 'rfk', 'y35', 'x35']

qnm AND rfk -> z35 <-- suspect
y35 XOR x35 -> rfk
wmn OR gpc -> qnm
wcd AND smf -> gpc
y34 AND x34 -> wmn

z34:
['z34', 'wcd', 'x34', 'y34', 'smf', 'gvs', 'hbn']

wcd XOR smf -> z34
x34 XOR y34 -> wcd
gvs OR hbn -> smf
mrj AND dnc -> gvs
x33 AND y33 -> hbn

z13:
['z13', 'rhg', 'x13', 'y13', 'fmh', 'jns', 'fdq']

rhg XOR fmh -> z13
x13 XOR y13 -> rhg
jns OR fdq -> fmh
y12 AND x12 -> jns
mhf AND tgs -> fdq

z12:
['z12', 'tgs', 'y12', 'x12', 'mhf', 'dnt', 'qjj']

tgs XOR mhf -> z12
y12 XOR x12 -> tgs
dnt OR qjj -> mhf
csm AND cbj -> dnt
y11 XOR x11 -> qjj <-- suspect

z11:
'z11', 'cbj', 'x11', 'y11', 'csm', 'tgf', 'stp'

cbj XOR csm -> z11
x11 AND y11 -> cbj <-- suspect
tgf OR stp -> csm
mvb AND mqd -> stp
x10 AND y10 -> tgf


z10:
['z10', 'mvb', 'y10', 'x10', 'mqd', 'cjr', 'nbd']

mvb XOR mqd -> z10
y10 XOR x10 -> mvb
cjr OR nbd -> mqd
msv AND vcs -> cjr
x09 AND y09 -> nbd

z09:
['z09', 'vcs', 'x09', 'y09', 'msv', 'tjc', 'hnb'

vcs XOR msv -> z09
x09 XOR y09 -> vcs
tjc OR hnb -> msv
whp AND rkw -> tjc
x08 AND y08 -> hnb

//
y08 XOR x08 -> whp
wnn OR gmt -> rkw

z19 orig:
dmn XOR dsj -> z19
hch XOR nff -> dmn
x19 XOR y19 -> dsj

z18 orig:
khk OR stg -> z18 < X, should XOR something to get z18
y18 XOR x18 -> hch
ksf AND bqf -> jkw
hnn OR jkw -> nff
x18 AND y18 -> khk < X, should be for z19s rules
nff AND hch -> stg
x17 AND y17 -> hnn

z19 fixed
dmn XOR dsj -> z19
x19 XOR y19 -> dsj
khk OR stg -> dmn
nff AND hch -> stg
x18 AND y18 -> khk

z18 fixed:
hch XOR nff -> z18
y18 XOR x18 -> hch
hnn OR jkw -> nff
ksf AND bqf -> jkw
x17 AND y17 -> hnn

z17: (good)
bqf XOR ksf -> z17
y17 XOR x17 -> bqf
vws OR qmp -> ksf
fnb AND fpg -> qmp
y16 AND x16 -> vws

z09 orig:
x09 XOR y09 -> vcs
vcs XOR msv -> z09
tjc OR hnb -> msv
whp AND rkw -> tjc
x08 AND y08 -> hnb

z08 orig:
rkw XOR whp -> z08
y08 XOR x08 -> whp
wmv AND whq -> kjf
y02 XOR x02 -> gsh
x00 AND y00 -> gmk
btp AND hsm -> jtg
y01 XOR x01 -> vgr
gsh AND nwk -> hhn
x07 XOR y07 -> mvw
x06 XOR y06 -> btp
x01 AND y01 -> jvm
x05 AND y05 -> wtq
jtg OR hgj -> pmc
x06 AND y06 -> hgj
fsm OR jvm -> nwk
y05 XOR x05 -> wmv
wnn OR gmt -> rkw
jjg OR ggr -> cnv
y03 AND x03 -> jjg
mvw AND pmc -> wnn
y04 XOR x04 -> fpr
x03 XOR y03 -> btf
btf AND sjn -> ggr
vgr AND gmk -> fsm
pmc XOR mvw -> gmt
x04 AND y04 -> mjc
gfh OR mjc -> whq
x02 AND y02 -> ksr
cnv AND fpr -> gfh
kjf OR wtq -> hsm
hhn OR ksr -> sjn

z07 orig:
y07 AND x07 -> z07

z08 fixed:
rkw XOR whp -> z08
y08 XOR x08 -> whp
wnn OR gmt -> rkw
wmv AND whq -> kjf
y07 AND x07 -> gmt

y02 XOR x02 -> gsh
x00 AND y00 -> gmk
btp AND hsm -> jtg
y01 XOR x01 -> vgr
gsh AND nwk -> hhn
x07 XOR y07 -> mvw
x06 XOR y06 -> btp
x01 AND y01 -> jvm
x05 AND y05 -> wtq
jtg OR hgj -> pmc
x06 AND y06 -> hgj
fsm OR jvm -> nwk
y05 XOR x05 -> wmv
jjg OR ggr -> cnv
y03 AND x03 -> jjg
mvw AND pmc -> wnn
y04 XOR x04 -> fpr
x03 XOR y03 -> btf
btf AND sjn -> ggr
vgr AND gmk -> fsm
x04 AND y04 -> mjc
gfh OR mjc -> whq
x02 AND y02 -> ksr
cnv AND fpr -> gfh
kjf OR wtq -> hsm
hhn OR ksr -> sjn

z07 fixed:
(swap gmt,z07
pmc XOR mvw -> z07

z06 orig:
btp XOR hsm -> z06
x06 XOR y06 -> btp
kjf OR wtq -> hsm
wmv AND whq -> kjf
x05 AND y05 -> wtq

z05 orig:
y05 XOR x05 -> wmv
wmv XOR whq -> z05
gfh OR mjc -> whq
cnv AND fpr -> gfh
x04 AND y04 -> mjc

*/
