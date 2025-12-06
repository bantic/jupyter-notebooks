use crate::utils::fs::read;
use std::ops::{Add, Mul};

pub fn run() {
    println!("Day 6");
    let inp = read(6).unwrap();
    let inp = parse(&inp);
    let p1 = solve(inp);
    println!("p1 {p1}");
}

fn solve(inp: Input) -> i64 {
    inp.eqs
        .into_iter()
        .map(|(op, nums)| {
            nums.into_iter()
                .reduce(|acc, n| match op {
                    Op::Add => n + acc,
                    Op::Mul => n * acc,
                })
                .iter()
                .sum::<i64>()
        })
        .sum()
}

#[derive(Debug, Clone, Copy)]
enum Op {
    Add,
    Mul,
}

type Eq = (Op, Vec<i64>);

#[derive(Debug)]
struct Input {
    eqs: Vec<Eq>,
}

fn parse(inp: &str) -> Input {
    let ops = inp.lines().last().unwrap();
    let ops: Vec<Op> = ops
        .split_ascii_whitespace()
        .filter_map(|c| match c {
            "+" => Some(Op::Add),
            "*" => Some(Op::Mul),
            _ => None,
        })
        .collect();
    let nums: Vec<Vec<i64>> = inp
        .lines()
        .rev()
        .skip(1)
        .map(|l| {
            l.split_ascii_whitespace()
                .map(|n| dbg!(n).parse().unwrap())
                .collect()
        })
        .collect();

    assert_eq!(ops.len(), nums[0].len());

    let mut eqs = Vec::new();
    for i in 0..ops.len() {
        let op = ops[i];
        let eq_nums: Vec<i64> = nums.clone().into_iter().map(|n| n[i]).collect();
        eqs.push((op, eq_nums));
    }

    Input { eqs }
}

#[test]
fn test_parse() {
    let inp = r"123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  ";
    dbg!(parse(inp));
    assert_eq!(0, 1);
}
