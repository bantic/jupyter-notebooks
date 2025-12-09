use itertools::Itertools;

use crate::utils::fs::read_day_year;

pub fn run() {
    println!("Day 9");
    let inp = read_day_year(9, 2025).unwrap();
    let p1 = solve1(&inp);
    println!("p1 {p1}");
}

type P2 = (i64, i64);

fn parse(inp: &str) -> Vec<P2> {
    inp.lines()
        .map(|l| {
            let (x, y) = l.split_once(',').unwrap();
            (x.parse().unwrap(), y.parse().unwrap())
        })
        .collect()
}

fn area((x1, y1): P2, (x2, y2): P2) -> i64 {
    let w = 1 + (x1 - x2).abs();
    let h = 1 + (y1 - y2).abs();
    w * h
}

fn solve1(inp: &str) -> i64 {
    let tiles = parse(inp);
    let rect_areas = tiles.iter().combinations(2).map(|combo| {
        let &p1 = combo[0];
        let &p2 = combo[1];
        area(p1, p2)
    });
    rect_areas.max().unwrap()
}
