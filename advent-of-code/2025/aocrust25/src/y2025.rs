mod day1;
mod day2;
mod day3;
mod day4;
mod day5;

pub fn run(day: Option<i8>) {
    if let Some(day) = day {
        println!("== 2025 ==");
        match day {
            1 => day1::run(),
            2 => day2::run(),
            3 => day3::run(),
            4 => day4::run(),
            5 => day5::run(),
            _ => unimplemented!(),
        }
    } else {
        run_all();
    }
}

pub fn run_all() {
    println!("== 2025 ==");
    day1::run();
    day2::run();
    day3::run();
    day4::run();
    day5::run();
}
