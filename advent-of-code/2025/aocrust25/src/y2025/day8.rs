use itertools::Itertools;
use std::collections::HashSet;

use crate::utils::fs::read_day_year;

pub fn run() {
    println!("Day 8");
    let inp = read_day_year(8, 2025).unwrap();
    let p1 = solve(&inp, true);
    println!("p1 {p1}");
    let p2 = solve(&inp, false);
    println!("p2 {p2}");
}

type P3 = (i64, i64, i64);

fn dist((x1, y1, z1): P3, (x2, y2, z2): P3) -> f64 {
    (((x1 - x2) as f64).powi(2) + ((y1 - y2) as f64).powi(2) + ((z1 - z2) as f64).powi(2)).sqrt()
}

fn solve(inp: &str, is_part_1: bool) -> i64 {
    let p3s = parse(inp);

    let sorted_pairs: Vec<(P3, P3)> = p3s
        .iter()
        .combinations(2)
        .map(|combo| {
            let p1 = combo[0];
            let p2 = combo[1];
            let d = dist(*p1, *p2);
            (d, p1, p2)
        })
        .sorted_by(|a, b| a.0.partial_cmp(&b.0).unwrap())
        .map(|(_, p1, p2)| (*p1, *p2))
        .collect();

    let mut circuits: Vec<HashSet<P3>> = p3s
        .into_iter()
        .map(|p| {
            let mut circuit = HashSet::new();
            circuit.insert(p);
            circuit
        })
        .collect();

    let mut connections = vec![];
    for (p1, p2) in sorted_pairs {
        let p1_circuit = match circuits.iter().position(|c| c.contains(&p1)) {
            Some(p1_circuit_idx) => circuits.remove(p1_circuit_idx),
            None => HashSet::new(),
        };
        let p2_circuit = match circuits.iter().position(|c| c.contains(&p2)) {
            Some(p2_circuit_idx) => circuits.remove(p2_circuit_idx),
            None => HashSet::new(),
        };

        let new_circuit = p1_circuit
            .union(&p2_circuit)
            .copied()
            .collect::<HashSet<_>>();

        circuits.push(new_circuit);

        connections.push((p1, p2));

        if (is_part_1 && connections.len() > 1000)
            || (circuits.len() == 1 && circuits[0].len() == 1000)
        {
            break;
        }
    }

    if is_part_1 {
        circuits
            .into_iter()
            .map(|g| g.len())
            .sorted()
            .rev()
            .take(3)
            .product::<usize>() as i64
    } else {
        let (p1, p2) = connections.last().unwrap();
        p1.0 * p2.0
    }
}

fn parse(inp: &str) -> Vec<P3> {
    inp.lines()
        .map(|l| {
            let vs: Vec<i64> = l.split(',').map(|v| v.parse().unwrap()).collect();
            (vs[0], vs[1], vs[2])
        })
        .collect()
}

#[test]
fn test_dist() {
    assert_eq!(dist((0, 0, 0), (0, 0, 0)), 0.0);
    assert_eq!(dist((1, 0, 0), (0, 0, 0)), 1.0);
    assert_eq!(dist((1, 1, 1), (0, 0, 0)), (3.0_f64).sqrt());
}

#[test]
fn test_1() {
    let inp = r"162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689";
    assert_eq!(solve1(inp), 40);
}
