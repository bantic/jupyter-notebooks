data = document.body.innerText.trim().split("\n");
dirs8 = [-1, 0, 1]
  .flatMap((d1) => [-1, 0, 1].map((d2) => [d1, d2]))
  .filter(([x, y]) => !(x === 0 && y === 0));
se = [1, -1];
sw = [-1, -1];
get = ([x, y]) => data[y]?.[x] || " ";
extend = (chain, dir, len) => {
  if (len === 1) return chain;
  let [dx, dy] = dir;
  let [x, y] = chain.at(-1);
  return extend([...chain, [x + dx, y + dy]], dir, len - 1);
};
sum = (arr) => arr.reduce((acc, m) => acc + m);
read = (pos, dir, len) => sum(extend([pos], dir, len).map(get));
let p1 = 0,
  p2 = 0;
for (let x = 0; x < data[0].length; x++) {
  for (let y = 0; y < data.length; y++) {
    p1 += dirs8.filter(dir => read([x,y],dir,4) === 'XMAS').length;
    p2 += (
      ["MAS", "SAM"].includes(read([x    , y], se, 3)) &&
      ["MAS", "SAM"].includes(read([x + 2, y], sw, 3))
    );
  }
}
console.log({p1, p2});