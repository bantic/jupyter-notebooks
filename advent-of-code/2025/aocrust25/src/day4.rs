use crate::utils::fs::read;
use std::collections::{HashMap, HashSet};

pub fn run() {
    println!("day 4");
    let data = read(4).expect("failed to get data for day 4");
    let p1 = solve(&data);
    println!("p1 {p1}");
    let p2 = solve2(&data);
    println!("p2 {p2}");
}

#[derive(Debug)]
enum Spot {
    Empty,
    Paper,
}

fn solve2(inp: &str) -> i64 {
    use Spot::*;

    let mut map = HashMap::new();
    for (y, line) in inp.lines().enumerate() {
        for (x, char) in line.chars().enumerate() {
            match char {
                '@' => {
                    map.insert((x, y), Paper);
                }
                '.' => {}
                _ => unreachable!("bad char {char}"),
            };
        }
    }

    let mut rem_count = 0i64;

    loop {
        let mut cur_marked = HashSet::new();

        for &pos in map.keys() {
            if let Some(Paper) = map.get(&pos) {
                let mut sum = 0;
                for adj in adj8(&pos) {
                    if let Some(Paper) = map.get(&adj) {
                        sum += 1;
                    }
                }
                if sum < 4 {
                    cur_marked.insert(pos);
                }
            }
        }

        for marked in &cur_marked {
            map.remove(marked);
        }
        rem_count += cur_marked.len() as i64;

        if cur_marked.is_empty() {
            break;
        }
    }

    rem_count
}

fn solve(inp: &str) -> i64 {
    use Spot::*;

    let mut map = HashMap::new();
    for (y, line) in inp.lines().enumerate() {
        for (x, char) in line.chars().enumerate() {
            match char {
                '@' => {
                    map.insert((x, y), Paper);
                }
                '.' => {}
                _ => unreachable!("bad char {char}"),
            };
        }
    }

    let mut p1 = 0;
    for pos in map.keys() {
        if let Some(Empty) = map.get(pos) {
            continue;
        }
        let mut sum = 0;
        for adj in adj8(pos) {
            if let Some(Paper) = map.get(&adj) {
                sum += 1;
            }
        }
        if sum < 4 {
            dbg!(pos.0, pos.1, sum);
            p1 += 1;
        }
    }

    p1
}

type Pos = (usize, usize);

fn adj8(pos: &Pos) -> Vec<Pos> {
    let &(x, y) = pos;
    let x = x as i64;
    let y = y as i64;
    let mut v = vec![];
    for dx in -1..=1 {
        for dy in -1..=1 {
            if dx == dy && dx == 0 {
                continue;
            }
            let x_ = x + dx;
            let y_ = y + dy;
            if x_ < 0 || y_ < 0 {
                continue;
            }
            v.push((x_ as usize, y_ as usize));
        }
    }
    v
}

#[test]
fn test_adj8() {
    assert_eq!(adj8(&(1, 1)).len(), 8);
    assert_eq!(adj8(&(0, 0)).len(), 3);

    assert_eq!(adj8(&(0, 0)), vec![(0, 1), (1, 0), (1, 1)]);
    assert_eq!(
        adj8(&(1, 1)),
        vec![
            (0, 0),
            (0, 1),
            (0, 2),
            (1, 0),
            (1, 2),
            (2, 0),
            (2, 1),
            (2, 2)
        ]
    );
}

#[test]
fn test_1() {
    let data = r"..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.";

    assert_eq!(solve(data), 13);
}
