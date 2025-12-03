use crate::utils::fs::read;

pub fn run() {
    println!("day 3");
    let data = read(3).expect("failed to get data for day 3");
    let p1 = solve(&data);
    println!("p1 {p1}");
    let p2 = solve2(&data);
    println!("p2 {p2}");
}

fn solve2(inp: &str) -> i64 {
    inp.lines().map(solve_line_2).sum()
}

const PART_2_LEN: i64 = 12;

fn solve_line_2(inp: &str) -> i64 {
    let digits = inp
        .chars()
        .map(|c| c.to_digit(10).unwrap() as i64)
        .collect::<Vec<i64>>();
    let mut on_digits: Vec<Option<i64>> = vec![None; digits.len()];
    let mut on_count = 0;
    // let on_count = || {
    //     let mut count = 0;
    //     for i in &on_digits {
    //         if i.is_some() {
    //             count += 1;
    //         }
    //     }
    //     count
    // };

    fn rightmost_range(on_digits: &[Option<i64>]) -> (usize, usize) {
        dbg!("RIGHTMOST RANGE", on_digits);

        let end_idx = on_digits.iter().rposition(|d| d.is_none()).unwrap();
        dbg!(end_idx);
        let mut start_idx = None;
        for i in (0..end_idx).rev() {
            if on_digits[i].is_some() {
                dbg!("on_digits[i].is_some", i);
                start_idx = Some(i + 1);
                break;
            }
        }
        (start_idx.unwrap_or(0), end_idx)
        // let mut start_idx = None;
        // let mut end_idx = None;
        // let len = on_digits.len();
        // for idx in (0..len).rev() {
        //     if end_idx.is_none() {
        //         if on_digits[idx].is_none() {
        //             end_idx = Some(idx);
        //         }
        //     } else if on_digits[idx].is_some() {
        //         start_idx = Some(idx + 1);
        //     }
        // }

        // if start_idx.is_none() {
        //     start_idx = Some(0);
        // }

        // (start_idx.unwrap(), end_idx.unwrap())
    }

    while on_count < PART_2_LEN {
        let (start_idx, end_idx) = rightmost_range(&on_digits);
        dbg!(on_count, "next range", start_idx, end_idx);

        let mut max = 0;
        let mut max_idx = 0;

        #[allow(clippy::needless_range_loop)]
        for i in start_idx..=end_idx {
            let v = digits[i];
            if v > max {
                max = v;
                max_idx = i;
                dbg!("new max", max, max_idx);
            }
        }

        dbg!("found", max, max_idx);
        on_digits[max_idx] = Some(max);
        on_count += 1;
    }

    dbg!(&on_digits);
    on_digits
        .iter()
        .filter(|&d| d.is_some())
        .map(|d| d.unwrap().to_string())
        .collect::<String>()
        .parse()
        .unwrap()
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

#[test]
fn test_solve_line_2() {
    // assert_eq!(solve_line_2("987654321111111"), 1);
    assert_eq!(solve_line_2("811111111111119"), 811111111119);
    assert_eq!(solve_line_2("987654321111111"), 987654321111);
    assert_eq!(solve_line_2("234234234234278"), 434234234278);
    assert_eq!(solve_line_2("818181911112111"), 888911112111);
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
