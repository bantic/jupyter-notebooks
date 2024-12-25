import fs from 'node:fs';
import assert from 'node:assert';
let data = fs.readFileSync("./data/day25.txt", "utf8").trim();

let testdata = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`;

let WIDTH = 5;
let HEIGHT = 5;
let BLOCK = '#';
let parse = data => data.split('\n\n').reduce((acc,str) => {
  let isLock = str.startsWith(BLOCK);
  let item = str.replaceAll('\n','').split('').reduce((counts,v,idx) => {
    counts[idx % WIDTH] ??= 0;
    if (v === BLOCK) {
      counts[idx % WIDTH] += 1;
    }
    return counts;
  }, {});
  // sub 1 for the filled start or bottom row
  item = Object.values(item).map(v => v -= 1);
  acc[isLock ? 'locks' : 'keys'].push(item);
  return acc;
}, {locks:[],keys:[]});

let isFit = (v1,v2) => v1.every((v,idx) => v+v2[idx] <= HEIGHT);

let solve = data => {
  let {locks,keys} = parse(data);
  let p1 = 0;
  for (let lock of locks) {
    for (let key of keys) {
      p1 += (isFit(lock,key));
    }
  }
  return p1;
}

console.log({p1: solve(data)});
