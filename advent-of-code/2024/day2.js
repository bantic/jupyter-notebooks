let p1 = true;
document.body.innerText.trim().split('\n').map(v => v.split(' ').map(v => parseInt(v))).reduce((acc,m) => {
  let diffs = arr => arr.reduce((_acc, _m, idx, _arr) => idx === 0 ? [] : [..._acc, _m - _arr[idx-1]], []);
  let safe = arr => diffs(arr).every(i => Math.abs(i) >= 1 && Math.abs(i) <= 3) &&
         new Set(diffs(arr).map(i => Math.sign(i))).size === 1;
   let safe2 = arr => {
     for (let i = 0; i < arr.length; i++) { if (safe(arr.toSpliced(i,1))) { return true; } }
   };
   return acc + !!(p1 ? safe(m) : safe2(m));
}, 0);