use crate::utils::fs::read;

const PART_1_LEN: i64 = 2;
const PART_2_LEN: i64 = 12;

pub fn run() {
    println!("day 3");
    let data = read(3).expect("failed to get data for day 3");
    let p1 = solve(&data, PART_1_LEN);
    println!("p1 {p1}");
    let p2 = solve(&data, PART_2_LEN);
    println!("p2 {p2}");
}

fn solve(inp: &str, max_len: i64) -> i64 {
    inp.lines().map(|l| solve_line(l, max_len)).sum()
}

fn solve_line(inp: &str, max_len: i64) -> i64 {
    let digits = inp
        .chars()
        .map(|c| c.to_digit(10).unwrap() as i64)
        .collect::<Vec<i64>>();
    let mut on_digits: Vec<Option<i64>> = vec![None; digits.len()];
    let mut on_count = 0;

    while on_count < max_len {
        let (start_idx, end_idx) = rightmost_range(&on_digits);

        let mut max = 0;
        let mut max_idx = 0;

        #[allow(clippy::needless_range_loop)]
        for i in start_idx..=end_idx {
            let v = digits[i];
            if v > max {
                max = v;
                max_idx = i;
            }
        }

        on_digits[max_idx] = Some(max);
        on_count += 1;
    }

    on_digits
        .iter()
        .filter_map(|&d| d.map(|d| d.to_string()))
        .collect::<String>()
        .parse()
        .unwrap()
}

fn rightmost_range(on_digits: &[Option<i64>]) -> (usize, usize) {
    let end_idx = on_digits.iter().rposition(|d| d.is_none()).unwrap();
    let mut start_idx = None;
    for i in (0..end_idx).rev() {
        if on_digits[i].is_some() {
            start_idx = Some(i + 1);
            break;
        }
    }
    (start_idx.unwrap_or(0), end_idx)
}

#[test]
fn test_solve_line() {
    assert_eq!(solve_line("12394565", 2), 96);
}

#[test]
fn test_solve_line_2() {
    assert_eq!(solve_line("811111111111119", 12), 811111111119);
    assert_eq!(solve_line("987654321111111", 12), 987654321111);
    assert_eq!(solve_line("234234234234278", 12), 434234234278);
    assert_eq!(solve_line("818181911112111", 12), 888911112111);
}

// 234234234234278 ->
// 2342342342342,X,X -> 78
// 23,X,2342342342,X,X -> 478
// 23,X,23,X,2342342,X,X -> 4478
// 23,X,23,X,23,X,23,X,2,X,X -> 444478
// 23,X,23,X,23,X,23,X,X,X,X -> 4444278
// 23,X,23,X,23,X,2,X,X,X,X,X -> 44434278
// 23,X,23,X,23,X,X,X,X,X,X,X -> 444234278
// 23,X,23,X,2,X,X,X,X,X,X,X,X -> 4434234278
// 23,X,23,X,X,X,X,X,X,X,X,X,X -> 44234234278
// 23,X,2,X,X,X,X,X,X,X,X,X,X,X -> 434234234278
