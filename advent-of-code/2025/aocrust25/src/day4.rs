use crate::utils::fs::read;
use itertools::Itertools;
use std::collections::HashSet;

pub fn run() {
    println!("day 4");
    let data = read(4).expect("failed to get data for day 4");
    let p1 = solve(&data, true);
    println!("p1 {p1}");
    let p2 = solve(&data, false);
    println!("p2 {p2}");
}

type Pos = (usize, usize);

fn find_removable(set: &HashSet<Pos>) -> HashSet<Pos> {
    set.iter()
        .filter_map(
            |pos| match adj8(pos).iter().filter_map(|adj| set.get(adj)).count() {
                len if len < 4 => Some(*pos),
                _ => None,
            },
        )
        .collect()
}

fn parse(inp: &str) -> HashSet<Pos> {
    inp.lines()
        .enumerate()
        .flat_map(|(y, line)| {
            line.chars()
                .enumerate()
                .filter(|(_, c)| *c == '@')
                .map(move |(x, _)| (x, y))
        })
        .collect()
}

fn solve(inp: &str, is_p1: bool) -> i64 {
    let mut map = parse(inp);
    if is_p1 {
        return find_removable(&map).len() as i64;
    }

    let mut rem_count = 0;
    loop {
        let removables = find_removable(&map);
        for to_rm in &removables {
            map.remove(to_rm);
        }
        rem_count += removables.len() as i64;

        if removables.is_empty() {
            break;
        }
    }
    rem_count
}

fn adj8(pos: &Pos) -> Vec<Pos> {
    let &(x, y) = pos;
    let x = x as i64;
    let y = y as i64;
    (-1..=1)
        .cartesian_product(-1..=1)
        .filter_map(|(dx, dy)| {
            if dx == 0 && dy == 0 {
                None
            } else {
                match ((x + dx), (y + dy)) {
                    (x_, _) if x_ < 0 => None,
                    (_, y_) if y_ < 0 => None,
                    (x_, y_) => Some((x_ as usize, y_ as usize)),
                }
            }
        })
        .collect()
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

    assert_eq!(solve(data, true), 13);
}
