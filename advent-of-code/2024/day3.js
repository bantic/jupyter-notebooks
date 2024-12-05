let p1 = false; document.body.innerText.trim().matchAll(/do\(\)|don't\(\)|mul\((\d{1,3}),(\d{1,3})\)/g).reduce((acc,m) => {
  let [enabled, sum] = acc;
  if (m[0].startsWith('do')) {
      if (p1) { return acc; }
      enabled = m[0] === 'do()';
      return [enabled, sum];
  }
  return [enabled, sum + (enabled ? (parseInt(m[1])*parseInt(m[2])) : 0)];
}, [true, 0])[1]