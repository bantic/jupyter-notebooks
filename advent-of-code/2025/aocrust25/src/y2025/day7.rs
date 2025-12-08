use std::collections::HashSet;

use crate::utils::fs::read_day_year;

pub fn run() {
    println!("Day 7");
    let inp = read_day_year(7, 2025).unwrap();
    let p1 = solve1(&inp);
    println!("p1 {p1}");
}

fn solve1(inp: &str) -> i64 {
    inp.lines()
        .enumerate()
        .fold((0, HashSet::new()), |(splits, beams), (idx, line)| {
            if idx == 0 {
                let beam = line.chars().position(|c| c == 'S').unwrap();
                let mut beams = HashSet::new();
                beams.insert(beam);
                (0, beams)
            } else {
                let mut next_beams = HashSet::new();
                let mut next_splits = splits;
                let chars: Vec<_> = line.chars().collect();
                for &beam in beams.iter() {
                    if chars[beam] == '^' {
                        next_splits += 1;
                        next_beams.insert(beam - 1);
                        next_beams.insert(beam + 1);
                    } else {
                        next_beams.insert(beam);
                    }
                }
                (next_splits, next_beams)
            }
        })
        .0
}
