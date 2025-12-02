use crate::utils::fs;

pub fn run() {
    let input = fs::read(2).expect("failed to read day 2");
    let p1 = solve(&input);
    println!("p1 {p1}");
}

fn solve(input: &str) -> i64 {
    let invalids = process(input);
    invalids.iter().sum()
}

fn process(input: &str) -> Vec<i64> {
    let mut invalids = vec![];
    for piece in input.split(',') {
        let mut nums = piece.split('-').map(|s| s.parse::<i64>().unwrap());
        let min = nums.next().unwrap();
        let max = nums.next().unwrap();
        dbg!(piece, min, max);

        for i in min..=max {
            if is_invalid(i) {
                invalids.push(i);
            }
        }
    }
    invalids
}

fn len_n(n: i64) -> u64 {
    (n as f64).log10().ceil() as u64
}

fn lhs(n: i64) -> i64 {
    n / 10_i64.pow(len_n(n) as u32 / 2)
}

fn rhs(n: i64) -> i64 {
    n - lhs(n) * 10_i64.pow(len_n(n) as u32 / 2)
}

fn is_invalid(n: i64) -> bool {
    len_n(n) % 2 == 0 && lhs(n) == rhs(n)
}

#[test]
fn test_is_invalid() {
    assert!(is_invalid(123123));
    assert!(is_invalid(1212));
    assert!(is_invalid(22));

    assert!(!is_invalid(212));
    assert!(!is_invalid(122));
    assert!(!is_invalid(121));
    assert!(!is_invalid(222));
}

#[test]
fn test_lhs() {
    assert_eq!(lhs(123500), 123);
    assert_eq!(lhs(1250), 12);
}

#[test]
fn test_rhs() {
    assert_eq!(rhs(123500), 500);
    assert_eq!(rhs(1250), 50);
}

#[test]
fn test_process() {
    assert_eq!(process("11-22"), vec![11, 22]);
    assert_eq!(process("95-115"), vec![99]);
    assert_eq!(process("998-1012"), vec![1010]);
    assert_eq!(process("1188511880-1188511890"), vec![1188511885]);
}

#[test]
fn test_1() {
    let input = "11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124";
    assert_eq!(solve(input), 1227775554);
}
