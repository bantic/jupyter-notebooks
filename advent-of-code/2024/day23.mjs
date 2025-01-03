import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day23.txt", "utf8").trim();

let testdata = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`.trim();

class Graph {
  nodes = new Set();
  edges = {};

  addEdge(a,b) {
    this.nodes.add(a);
    this.nodes.add(b);
    this.edges[a] ??= new Set();
    this.edges[b] ??= new Set();
    this.edges[a].add(b);
    this.edges[b].add(a);
  }
}

let parse = data => {
  let g = new Graph();
  let lines = data.split('\n').forEach(l => g.addEdge(...l.split('-')));
  return g;
}

let combinations2 = (arr) => {
  let out = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i+1; j < arr.length; j++) {
      out.push(
        [arr[i],arr[j]]
      );
    }
  }
  return out;
}

let allConnected = (g,group) => {
  for (let i = 0; i < group.length; i++) {
    let v = group[i];
    if (group.slice(i+1).some(v2 => !g.edges[v].has(v2))) return false;
  }
  return true;
}

let is3Cycle = (g, [a,b,c]) => {
  return g.edges[a]?.has(b) && g.edges[a]?.has(c) && g.edges[b]?.has(c);
};
let get3Cycles = (g,n) => {
  let combos = combinations2(Array.from(g.edges[n]));
  return combos.filter(c => is3Cycle(g, [n,...c])).map(([a,b]) => [n,a,b].sort());
};

let solve = data => {
  let g = parse(data);
  let all3Cycles = Object.keys(g.edges).flatMap(n => get3Cycles(g,n));
  let uniq3Cycles = Array.from(new Set(all3Cycles.map(c => JSON.stringify(c)))).map(v => JSON.parse(v));
  let uniqT3Cycles = uniq3Cycles.filter(arr => arr.some(v => v.startsWith('t')));
  return uniqT3Cycles.length;
}

let solve2 = data => {
  let g = parse(data);
  let longest = [];

  for (let n of g.nodes) {
    let edges = Array.from(g.edges[n]);
    let [a,...rest] = edges;
    let group = [n,a];
    let idx = 0;
    while (allConnected(g,group) && idx < rest.length) {
      longest = group.length > longest.length ? [...group] : longest;
      idx++;
      group.push(rest[idx]);
    }
  }

  return longest.sort().join(',');
}

let p1 = solve(data);
console.log({p1});
let p2 = solve2(data);
console.log({p2});
