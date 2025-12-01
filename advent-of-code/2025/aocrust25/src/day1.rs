use crate::utils::fs;

pub fn run() {
    let input = fs::read(1).expect("failed to read day 1");
    let mut p1 = 0;
    let mut p2 = 0;

    let mut pos = 50;
    for (dir, amt) in parse(&input) {
        let d = dir as i16;
        for _ in 0..amt {
            pos += d;
            if pos == 100 {
                pos = 0;
            }
            if pos == -1 {
                pos = 99;
            }
            if pos == 0 {
                p2 += 1;
            }
        }
        if pos == 0 {
            p1 += 1;
        }
    }
    println!("p1 {p1}");
    println!("p2 {p2}");
}

enum Dir {
    L = -1,
    R = 1,
}

fn parse(s: &str) -> Vec<(Dir, i16)> {
    use Dir::*;

    let mut out = vec![];

    for line in s.lines() {
        let d = if line.starts_with('R') { R } else { L };
        let amt: i16 = line[1..].parse().expect("failed to parse");
        out.push((d, amt));
    }
    out
}
