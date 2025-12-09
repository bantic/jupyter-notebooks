use std::collections::{HashMap, HashSet};

use crate::utils::fs::read_day_year;
// p2 380338654075 too low

pub fn run() {
    println!("Day 7");
    let inp = read_day_year(7, 2025).unwrap();
    let p1 = solve1(&inp);
    println!("p1 {p1}");
    let p2 = solve2(&inp);
    println!("p2 {p2}");
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

fn solve2(inp: &str) -> i64 {
    inp.lines()
        .enumerate()
        .fold((0, HashMap::new()), |(splits, beams), (idx, line)| {
            if idx == 0 {
                let beam = line.chars().position(|c| c == 'S').unwrap();
                let mut beams = HashMap::new();
                beams.insert(beam, 1);
                (0, beams)
            } else {
                let mut next_beams = HashMap::new();
                let mut next_splits = splits;
                let chars: Vec<_> = line.chars().collect();
                for (&beam, &count) in beams.iter() {
                    let should_dbg = idx == 10 && beam == 9;

                    if should_dbg {
                        dbg!(idx, beam, count, next_beams.get(&(beam - 1)));
                    }

                    if chars[beam] == '^' {
                        next_splits += 1;

                        *next_beams.entry(beam - 1).or_insert(0) += count;
                        *next_beams.entry(beam + 1).or_insert(0) += count;
                    } else {
                        *next_beams.entry(beam).or_insert(0) += count;
                    }
                }
                dbg!(idx, &next_beams, &next_beams.values().sum::<i64>());
                (next_splits, next_beams)
            }
        })
        .1
        .values()
        .sum()
}

#[test]
fn test_2() {
    let inp = r".......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............";
    assert_eq!(solve2(inp), 40);
}
