use std::collections::HashMap;

use crate::utils::fs::read_day_year;

pub fn run() {
    println!("Day 7");
    let inp = read_day_year(7, 2025).unwrap();
    let inp = process(&inp);
    let p1 = inp.0;
    let p2: i64 = inp.1.values().sum();
    println!("p1 {p1}");
    println!("p2 {p2}");
}

fn process(inp: &str) -> (i64, std::collections::HashMap<usize, i64>) {
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
                    if chars[beam] == '^' {
                        next_splits += 1;

                        *next_beams.entry(beam - 1).or_insert(0) += count;
                        *next_beams.entry(beam + 1).or_insert(0) += count;
                    } else {
                        *next_beams.entry(beam).or_insert(0) += count;
                    }
                }
                (next_splits, next_beams)
            }
        })
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
    assert_eq!(process(inp).1.values().sum::<i64>(), 40);
}
