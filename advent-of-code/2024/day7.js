fs = require("node:fs");
data = fs.readFileSync("./data/day7.txt", { encoding: "utf8" }).trim();
toInts = (str) => Array.from(str.matchAll(/-?\d+/g)).map((v) => parseInt(v));
p1 = p2 = 0;
add = (a, b) => a + b;
mul = (a, b) => a * b;
cat = (a, b) => a * Math.pow(10, 1 + Math.floor(Math.log10(b))) + b;

isValid = (test, nums, ops = [add, mul]) => {
  if (nums.length === 1) {
    return test === nums[0];
  }
  let [a, b, ...tail] = nums;
  return ops.some((op) => isValid(test, [op(a, b), ...tail], ops));
};

for (let line of data.split("\n")) {
  let [test, ...nums] = toInts(line);
  if (isValid(test, nums, [add, mul])) {
    p1 += test;
    p2 += test;
  } else if (isValid(test, nums, [add, mul, cat])) {
    p2 += test;
  }
}
console.log({ p1, p2 });
