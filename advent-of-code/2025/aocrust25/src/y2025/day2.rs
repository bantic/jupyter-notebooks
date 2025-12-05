use crate::utils::fs;

pub fn run() {
    println!("Day 2");
    let input = fs::read(2).expect("failed to read day 2");
    let p1 = solve(&input, true);
    println!("p1 {p1}");
    let p2 = solve(&input, false);
    println!("p2 {p2}");
}

fn solve(input: &str, is_p1: bool) -> i64 {
    let invalids = process(input, is_p1);
    invalids.iter().sum()
}

fn process(input: &str, is_p1: bool) -> Vec<i64> {
    let mut invalids = vec![];
    for piece in input.split(',') {
        let mut nums = piece.split('-').map(|s| s.parse::<i64>().unwrap());
        let min = nums.next().unwrap();
        let max = nums.next().unwrap();

        for i in min..=max {
            if is_invalid(i, is_p1) {
                invalids.push(i);
            }
        }
    }
    invalids
}

fn is_invalid(n: i64, is_p1: bool) -> bool {
    let n = format!("{n}");
    let c = n.chars().collect::<Vec<char>>();
    let sizes = if is_p1 {
        let mid = n.len() / 2;
        if mid == 0 {
            return false;
        }
        mid..=mid
    } else {
        1..=(n.len() / 2)
    };

    for size in sizes {
        let mut chunks = c.chunks(size);
        let head = chunks.next().unwrap();
        let mut tail = chunks;
        if tail.all(|t| t == head) {
            return true;
        }
    }

    false
}
