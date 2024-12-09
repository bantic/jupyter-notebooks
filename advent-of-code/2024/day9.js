fs = require("node:fs");
assert = require("node:assert");
data = fs.readFileSync("./data/day9.txt", { encoding: "utf8" }).trim();
toInt = (v) => parseInt(v);
nums = data.split("").map(toInt);
diskIdx = 0;
disk = [];
FREE = ".";
nums.forEach((count, idx) => {
  if (idx % 2 === 0) {
    let id = idx / 2;
    for (let i = 0; i < count; i++) {
      disk[diskIdx] = id;
      diskIdx++;
    }
  } else {
    for (let i = 0; i < count; i++) {
      disk[diskIdx] = FREE;
      diskIdx++;
    }
  }
});
let freeIdxs = disk.reduce((acc, v, idx) => {
  if (v === FREE) acc.push(idx);
  return acc;
}, []);
for (
  let j = disk.length - 1, freeIdx = freeIdxs.shift();
  freeIdx >= 0 && j >= freeIdx;
  j--
) {
  if (disk[j] !== FREE) {
    disk[freeIdx] = disk[j];
    disk[j] = FREE;
    freeIdx = freeIdxs.shift() ?? -1;
  }
}
checksum = (arr) =>
  arr.reduce((acc, v, idx) => (acc += v === FREE ? 0 : v * idx), 0);
console.log({ p1: checksum(disk) });

{
  let diskIdx = 0;
  let blocks = nums.map((count, idx) => {
    let id = idx % 2 === 0 ? idx / 2 : FREE;
    let start = diskIdx,
      len = count;
    diskIdx += len;
    return {
      id,
      start,
      len,
    };
  });
  let toLL = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (i > 0) arr[i].prev = arr[i - 1];
      if (i < arr.length - 1) arr[i].next = arr[i + 1];
    }
    return { start: arr[0], end: arr.at(-1) };
  };
  blocks = toLL(blocks);
  findBlockBefore = (beforeBlock, cb) => {
    let block = blocks.start;
    while (block) {
      if (block === beforeBlock) return;
      if (cb(block)) return block;
      block = block.next;
    }
  };
  filterBlocks = (cb) => {
    let block = blocks.start;
    let acc = [];
    while (block) {
      if (cb(block)) acc.push(block);
      block = block.next;
    }
    return acc;
  };
  llToArr = (ll) => {
    let acc = [];
    let item = ll.start;
    while (item) {
      acc.push(item);
      item = item.next;
    }
    return acc;
  };
  print = (blocks) => {
    return;
    console.log(
      llToArr(blocks)
        .map((b) => b.id.toString().repeat(b.len))
        .join("|")
    );
  };
  mergeFreeNeighbors = (block) => {
    let blocks = [block.prev, block, block.next];
    blocks = blocks.filter(Boolean).filter((b) => b.id === FREE);
    let [base, ...rest] = blocks;
    while (rest.length) {
      let nextBlock = rest.shift();
      base.len += nextBlock.len;
      base.next = nextBlock.next;
      if (base.next) {
        base.next.prev = base;
      }
    }
  };
  let splitBlock = (block, newLen) => {
    let rem = block.len - newLen;
    let newBlock = { id: FREE, len: rem };
    block.len = newLen;
    newBlock.next = block.next;
    newBlock.prev = block;
    block.next = newBlock;
    return block;
  };
  for (let block of filterBlocks((b) => b.id !== FREE).toReversed()) {
    print(blocks);
    console.log(block.id, block.len);

    let availBlock = findBlockBefore(
      block,
      (b) => b.id === FREE && b.len >= block.len
    );
    if (!availBlock) continue;

    if (availBlock.len > block.len) {
      availBlock = splitBlock(availBlock, block.len);
    }

    availBlock.id = block.id;
    block.id = FREE;

    mergeFreeNeighbors(availBlock);
    mergeFreeNeighbors(block);
  }
  print(blocks);
  let decompressed = llToArr(blocks).reduce((arr, block) => {
    for (let i = 0; i < block.len; i++) {
      arr.push(block.id);
    }
    return arr;
  }, []);
  // 6596538422077 too high (?)
  // 6423258376982
  let p2 = checksum(decompressed);
  console.log({ p2 });
}
