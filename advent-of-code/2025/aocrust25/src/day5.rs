use std::{
    collections::HashSet,
    ops::{Range, RangeInclusive},
};

use crate::utils::fs::read;

pub fn run() {
    println!("Day 5");
    let inp = read(5).expect("no day 5");
    let p1 = solve1(&inp);
    println!("p1 {p1}");
    let p2 = solve2(&inp);
    println!("p2 {p2}");
}

type Answer = i64;

fn solve2(inp: &str) -> Answer {
    let inp = parse(inp);

    let mut ranges = inp.ranges;

    ranges.sort_by(|lhs, rhs| lhs.start().cmp(rhs.start()));
    dbg!(&ranges);

    let ranges = ranges.iter().fold(Vec::new(), |mut acc, r| {
        let last = acc.pop();
        acc.append(&mut union(last, r.clone()));

        acc
    });
    dbg!(&ranges);

    ranges.into_iter().map(|r| r.count() as Answer).sum()
}

fn union(
    lhs: Option<RangeInclusive<Ingredient>>,
    rhs: RangeInclusive<Ingredient>,
) -> Vec<RangeInclusive<Ingredient>> {
    if let Some(lhs) = lhs {
        assert!(lhs.start() <= rhs.start());

        let is_overlapping = lhs.end() >= rhs.start();
        let contains = lhs.start() <= rhs.start() && lhs.end() >= rhs.end();

        if contains {
            return vec![lhs];
        } else if is_overlapping {
            let &start = lhs.start().min(rhs.start());
            let &end = lhs.end().max(rhs.end());
            return vec![start..=end];
        } else {
            return vec![lhs, rhs];
            // let &lhs_min = lhs.start(); // 10
            // let &lhs_max = lhs.end().min(rhs.start()); // 14 min 12 -> 12
            // let &rhs_min = lhs.end().max(rhs.start()); // 14 max 12 -> 14
            // let &rhs_max = rhs.end();

            // // assert_eq!(union(Some(10..=14), 12..=18), vec![0..=18]);
            // // [10..=12, 14..=18]

            // assert!(lhs_min <= lhs_max && lhs_max <= rhs_min && rhs_min <= rhs_max);

            // if rhs_min - lhs_max <= 1 {
            //     return vec![lhs_min..=rhs_max];
            // }

            // return vec![lhs_min..=lhs_max, rhs_min..=rhs_max];
        }
    }

    vec![rhs]
}

#[test]
fn test_union() {
    assert_eq!(union(Some(0..=1), 1..=2), vec![0..=2]);
    assert_eq!(union(Some(0..=1), 2..=3), vec![0..=1, 2..=3]);
    assert_eq!(union(Some(0..=1), 0..=3), vec![0..=3]);
    assert_eq!(union(Some(0..=3), 0..=1), vec![0..=3]);
    assert_eq!(union(Some(0..=2), 2..=3), vec![0..=3]);
    assert_eq!(union(Some(0..=2), 3..=4), vec![0..=2, 3..=4]);
    // [10..=12, 14..=18]
    assert_eq!(union(Some(10..=14), 12..=18), vec![10..=18]);
}

fn solve1(inp: &str) -> Answer {
    let inp = parse(inp);
    inp.ingredients
        .iter()
        .filter(|i| inp.ranges.iter().any(|r| r.contains(i)))
        .count() as Answer
}

type Ingredient = i64;

#[derive(Debug)]
struct Input {
    ranges: Vec<RangeInclusive<Ingredient>>,
    ingredients: Vec<Ingredient>,
}

fn parse(inp: &str) -> Input {
    let (ranges, ingredients) = inp.split_once("\n\n").unwrap();
    let ranges: Vec<RangeInclusive<Ingredient>> = ranges
        .lines()
        .map(|line| {
            let (lhs, rhs) = line.split_once('-').unwrap();
            lhs.parse().unwrap()..=rhs.parse().unwrap()
        })
        .collect();
    let ingredients: Vec<Ingredient> = ingredients.lines().map(|l| l.parse().unwrap()).collect();
    Input {
        ranges,
        ingredients,
    }
}

#[test]
fn test_p1() {
    let inp = r"3-5
10-14
16-20
12-18

1
5
8
11
17
32";

    assert_eq!(solve1(inp), 3);
}

#[test]
fn test_p2() {
    let inp = r"3-5
10-14
16-20
12-18

1
5
8
11
17
32";

    assert_eq!(solve2(inp), 14);
}
