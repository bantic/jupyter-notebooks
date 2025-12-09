use crate::utils::fs::read_day_year;

pub fn run() {
    println!("Day 6");
    let inp = read_day_year(6, 2025).unwrap();
    let p1 = solve(parse(&inp));
    println!("p1 {p1}");
    let p2 = solve2(&inp);
    println!("p2 {p2}");
}

fn get_ops_w_widths(ops: &str) -> Vec<(usize, usize, Op)> {
    let mut ret = vec![];

    let ops: Vec<_> = ops.chars().collect();

    let mut cur_op = ops[0];
    let mut cur_width: usize = 0;
    let mut cur_op_idx = 0;

    for (idx, c) in ops.into_iter().enumerate().skip(1) {
        if c == ' ' {
            cur_width += 1;
        } else {
            ret.push((cur_width, cur_op_idx, cur_op));
            cur_width = 0;
            cur_op = c;
            cur_op_idx = idx;
        }
    }

    ret.push((cur_width + 1, cur_op_idx, cur_op));

    ret.iter()
        .map(|&(width, idx, op)| {
            let op = match op {
                '*' => Op::Mul,
                '+' => Op::Add,
                _ => unreachable!(),
            };
            (width, idx, op)
        })
        .collect()
}

fn solve2(inp: &str) -> i64 {
    let lines = inp.lines().collect::<Vec<&str>>();
    let (&ops, nums) = lines.split_last().unwrap();
    let grid_width = nums[0].len();

    let ops_w_widths = get_ops_w_widths(ops);

    let num_height = nums.len();
    let nums = nums
        .iter()
        .flat_map(|line| line.chars())
        .collect::<Vec<_>>();

    ops_w_widths
        .iter()
        .map(|&(op_width, op_idx, op)| {
            let eq_args: Vec<i64> = (0..(nums.len()))
                .skip(op_idx)
                .take(op_width)
                .map(|n_idx| {
                    let col = (n_idx..nums.len())
                        .step_by(grid_width)
                        .take(num_height)
                        .map(|idx| nums[idx])
                        .collect::<String>();
                    col.trim().parse::<i64>().unwrap()
                })
                .collect();

            eq_args
                .into_iter()
                .reduce(|acc, n| match op {
                    Op::Add => acc + n,
                    Op::Mul => acc * n,
                })
                .unwrap()
        })
        .sum()
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
                .map(|n| n.parse().unwrap())
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
fn test_2() {
    let inp = r"123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  ";
    dbg!(solve2(inp));
    assert_eq!(solve2(inp), 3263827);
}
