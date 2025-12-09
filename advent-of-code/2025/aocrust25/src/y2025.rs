mod day1;
mod day2;
mod day3;
mod day4;
mod day5;
mod day6;
mod day7;
mod day8;

pub fn run(day: Option<i8>) {
    if let Some(day) = day {
        println!("== 2025 ==");
        match day {
            1 => day1::run(),
            2 => day2::run(),
            3 => day3::run(),
            4 => day4::run(),
            5 => day5::run(),
            6 => day6::run(),
            7 => day7::run(),
            8 => day8::run(),
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
    day6::run();
    day7::run();
    day8::run();
}
