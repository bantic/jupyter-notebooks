use std::collections::HashMap;

use crate::utils::fs::read_day_year;

pub fn run() {
    println!("Day 7");
    let inp = read_day_year(7, 2025).unwrap();
    let (p1, p2) = solve(&inp);
    println!("p1 {p1}");
    println!("p2 {p2}");
}

fn solve(inp: &str) -> (i64, i64) {
    let lines = inp.lines().collect::<Vec<_>>();
    let (first, rest) = lines.split_first().unwrap();

    let init_beam = first.chars().position(|c| c == 'S').unwrap();
    let mut init_beams = HashMap::new();
    init_beams.insert(init_beam, 1);
    let init_splits = 0;
    let init_state = (init_splits, init_beams);

    let processed = rest.iter().fold(init_state, |(splits, beams), line| {
        let mut next_beams = HashMap::new();
        let mut next_splits = splits;
        let chars: Vec<_> = line.chars().collect();
        for (&beam, &count) in beams.iter() {
            if chars[beam] == '^' {
                next_splits += 1;

                *next_beams.entry(beam - 1).or_insert(0) += count;
                *next_beams.entry(beam + 1).or_insert(0) += count;
            } else {
                *next_beams.entry(beam).or_insert(0) += count;
            }
        }
        (next_splits, next_beams)
    });

    (processed.0, processed.1.values().sum())
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
    assert_eq!(solve(inp).0, 21);
    assert_eq!(solve(inp).1, 40);
}
