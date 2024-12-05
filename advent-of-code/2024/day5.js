data = document.body.innerText.trim();
toInts = str => Array.from(str.matchAll(/\d+/g)).map(v => parseInt(v));
let [pairs,seqs] = data.split('\n').reduce(([pairs,seqs],line) => {
    line.includes('|') && pairs.push(toInts(line));
    line.includes(',') && seqs.push(toInts(line));
    return [pairs,seqs];
}, [[],[]]);
afters = pairs.reduce((map,[lo,hi]) => { map[lo] ??= []; map[lo].push(hi); return map; },{});
isAfter = (rhs,lhs) => !(afters[rhs] || []).includes(lhs);
isValid = seq => {
    for (let i = 0; i < seq.length; i++) {
        let lhs = seq[i], rest = seq.slice(i+1);
        if (rest.some(rhs => !isAfter(rhs,lhs))) { return false; }
    }
    return true;
};
isNotValid = seq => !isValid(seq);
mid = arr => arr.at(Math.floor(arr.length/2));
sum = arr => arr.reduce((sum,v) => sum+v,0);
p1 = sum(seqs.filter(isValid).map(mid));
sort = arr => arr.toSorted((lhs,rhs) => !isAfter(lhs,rhs) ? -1 : 1);
p2 = sum(seqs.filter(isNotValid).map(sort).map(mid));
[p1,p2]