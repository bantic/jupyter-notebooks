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
let parse = data => {
  debugger;
  return data.split('\n\n').reduce((acc,str) => {
    let isLock = str.startsWith('#');
    let orig = str;
    if (str.startsWith('#')) {
      str = str.split('\n').slice(1).join('\n');
    } else {
      str = str.split('\n').slice(0,6).join('\n');
    }
    let item = str.replaceAll('\n','').split('').reduce((counts,v,idx) => {
      counts[idx % WIDTH] ??= 0;
      if (v === '#') {
        counts[idx % WIDTH] += 1;
      }
      return counts;
    }, {});
    acc[isLock ? 'locks' : 'keys'].push(Object.values(item));
    return acc;
  }, {locks:[],keys:[]});
}

let isFit = (v1,v2) => {
  let _isFit = v1.every((v,idx) => v+v2[idx] <= HEIGHT);
  console.log('compare',v1,v2,_isFit);
  return _isFit;
}

let solve = data => {
  let {locks,keys} = parse(data);
  let p1 = 0;
  for (let lock of locks) {
    for (let key of keys) {
      if (isFit(lock,key)) {
        p1 += 1;
      }
    }
  }
  return p1;
}

// console.log(parse(testdata));
// wrong: 50
// wrong: 9135
console.log({p1: solve(data)});
