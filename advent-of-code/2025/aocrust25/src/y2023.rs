mod day2;

pub fn run(day: Option<i8>) {
    if let Some(day) = day {
        println!("== 2023 == ");
        match day {
            2 => day2::run(),
            _ => unimplemented!(),
        }
    } else {
        run_all();
    }
}

pub fn run_all() {
    println!("== 2023 == ");
    day2::run();
}
