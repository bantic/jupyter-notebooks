fs = require("node:fs");
assert = require("node:assert");
data = fs.readFileSync("./data/day13.txt", "utf8").trim();
toInt = (v) => parseInt(v);
toInts = (str) => Array.from(str.matchAll(/-?\d+/g)).map(toInt);
games = data.split('\n').reduce((games, line) => {
  if (line === '') {
    games.push([]);
  } else {
    games.at(-1).push(toInts(line));
  }
  return games;
},[[]]);

// cramer's rule for solving systems of linear equations
// https://en.wikipedia.org/wiki/Cramer%27s_rule
det = determinant = mat2x2 => {
  let [a11,a12] = mat2x2[0];
  let [a21,a22] = mat2x2[1];
  return a11*a22 - a21*a12;
}

solve = (game,{p1,p2}) => {
  // turn into 2 linear equations of form
  // x1*a +x2*b = z1
  // y1*a +y2*b = z2
  // used this to help visualize where the numbers fit:
  // https://matrixcalc.org/slu.html#solve-using-Cramer%27s-rule%28%7B%7B94,22,0,0,8400%7D,%7B34,67,0,0,5400%7D%7D%29
  let [x1,y1] = game[0]
  let [x2,y2] = game[1]
  let [z1,z2] = game[2];
  if (p2) {
    z1 += 10000000000000;
    z2 += 10000000000000;
  }

  let denom = det([[x1,x2],[y1,y2]]);
  let deta = det([[z1,x2],[z2,y2]]);
  let detb = det([[x1,z1],[y1,z2]]);
  let a = deta/denom;
  let b = detb/denom;
  return [a,b];
}
isValidSolution = ([a,b]) => {
  return (a >= 0 && b >= 0 && Number.isInteger(a) && Number.isInteger(b));
}
let p1 = games.reduce((sum, game) => {
  let [a,b] = solve(game,{p1:true});
  if (isValidSolution([a,b])) {
    sum += 3*a+b;
  }
  return sum;
}, 0);
console.log({p1})
let p2 = games.reduce((sum, game) => {
  let [a,b] = solve(game,{p2:true});
  if (isValidSolution([a,b])) {
    sum += 3*a+b;
  }
  return sum;
}, 0);
console.log({p2})
