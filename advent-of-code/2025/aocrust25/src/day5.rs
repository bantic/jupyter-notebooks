use crate::utils::fs::read;
use std::ops::RangeInclusive;

type Answer = i64;
type Ingredient = i64;
type IngRange = RangeInclusive<Ingredient>;

#[derive(Debug)]
struct Input {
    ranges: Vec<IngRange>,
    ingredients: Vec<Ingredient>,
}

pub fn run() {
    println!("Day 5");
    let inp = parse(&read(5).expect("no day 5"));
    let p1 = solve1(&inp);
    println!("p1 {p1}");
    let p2 = solve2(&inp);
    println!("p2 {p2}");
}

fn parse(inp: &str) -> Input {
    let (ranges, ingredients) = inp.split_once("\n\n").unwrap();
    let ranges: Vec<IngRange> = ranges
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

fn solve1(inp: &Input) -> Answer {
    inp.ingredients
        .iter()
        .filter(|i| inp.ranges.iter().any(|r| r.contains(i)))
        .count() as Answer
}

fn solve2(inp: &Input) -> Answer {
    let mut ranges = inp.ranges.clone();

    ranges.sort_by(|lhs, rhs| lhs.start().cmp(rhs.start()));

    ranges
        .iter()
        .fold(Vec::new(), |mut acc, r| {
            let last = acc.pop();
            acc.append(&mut union(last, r.clone()));
            acc
        })
        .into_iter()
        .map(|r| r.count() as Answer)
        .sum()
}

fn union(lhs: Option<IngRange>, rhs: IngRange) -> Vec<IngRange> {
    match lhs {
        Some(lhs) => {
            let is_overlapping = lhs.end() >= rhs.start();
            let contains = lhs.start() <= rhs.start() && lhs.end() >= rhs.end();

            match (contains, is_overlapping) {
                (true, _) => vec![lhs],
                (_, true) => {
                    let &start = lhs.start().min(rhs.start());
                    let &end = lhs.end().max(rhs.end());
                    vec![start..=end]
                }
                (false, false) => vec![lhs, rhs],
            }
        }
        None => vec![rhs],
    }
}

#[test]
fn test_union() {
    assert_eq!(union(Some(0..=1), 1..=2), vec![0..=2]);
    assert_eq!(union(Some(0..=1), 2..=3), vec![0..=1, 2..=3]);
    assert_eq!(union(Some(0..=1), 0..=3), vec![0..=3]);
    assert_eq!(union(Some(0..=3), 0..=1), vec![0..=3]);
    assert_eq!(union(Some(0..=2), 2..=3), vec![0..=3]);
    assert_eq!(union(Some(0..=2), 3..=4), vec![0..=2, 3..=4]);
    assert_eq!(union(Some(10..=14), 12..=18), vec![10..=18]);
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

    assert_eq!(solve1(&parse(inp)), 3);
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

    assert_eq!(solve2(&parse(inp)), 14);
}
