use crate::utils::fs;

pub fn run() {
    let input = fs::read(1).expect("failed to read day 1");
    let res = parse(&input);
    dbg!(&res);

    let mut hits = 0;
    let mut start = 50;
    for (dir, amt) in res {
        start = turn(start, &dir, amt);
        dbg!((start, dir, amt));
        if start == 0 {
            hits += 1;
        }
    }
    println!("hits {hits}");
}

#[derive(Debug)]
enum Dir {
    L,
    R,
}

fn parse(s: &str) -> Vec<(Dir, i16)> {
    use Dir::*;

    let mut out = vec![];

    for line in s.lines() {
        let d: Dir = if line.starts_with('R') { R } else { L };
        let amt: i16 = line[1..].parse().expect("failed to parse");
        out.push((d, amt));
    }
    out
}

fn turn(start: i16, d: &Dir, amt: i16) -> i16 {
    let mut res = match d {
        Dir::L => start - amt,
        Dir::R => start + amt,
    };
    while res < 100 {
        res += 100;
    }
    while res >= 100 {
        res -= 100;
    }
    res
}

#[cfg(test)]
mod tests {
    use super::Dir::*;
    use super::*;

    #[test]
    fn mod_add() {
        assert_eq!(turn(95, &R, 10), 5);
        assert_eq!(turn(95, &R, 5), 0);
        assert_eq!(turn(95, &R, 5 + 100 + 3), 3);
    }

    #[test]
    fn mod_sub() {
        assert_eq!(turn(5, &L, 10), 95);
        assert_eq!(turn(5, &L, 5), 0);
        assert_eq!(turn(5, &L, 5 + 100 + 3), 97);
        assert_eq!(turn(50, &L, 68), 82);
    }
}
