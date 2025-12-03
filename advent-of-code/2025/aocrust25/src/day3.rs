use crate::utils::fs::read;

pub fn run() {
    println!("day 3");
    let _data = read(3).expect("failed to get data for day 3");
    let p1 = solve(&_data);
    println!("p1 {p1}");
}

fn solve(inp: &str) -> i64 {
    inp.lines().map(solve_line).sum()
}

fn solve_line(inp: &str) -> i64 {
    let digits = inp
        .chars()
        .map(|c| c.to_digit(10).unwrap() as i64)
        .collect::<Vec<i64>>();

    let first = digits.iter().take(digits.len() - 1).max().unwrap();
    let first_idx = digits.iter().position(|d| d == first).unwrap();
    let second = digits.iter().skip(first_idx + 1).max().unwrap();

    format!("{first}{second}").parse().unwrap()
}

#[test]
fn test_solve_line() {
    assert_eq!(solve_line("12394565"), 96);
}
