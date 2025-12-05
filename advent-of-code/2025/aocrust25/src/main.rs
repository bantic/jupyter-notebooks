#[allow(dead_code)]
mod utils;
mod y2023;
mod y2025;
use chrono::Datelike;
use clap::{arg, Parser};

#[derive(Parser)]
struct Args {
    #[arg(long)]
    all: bool,

    #[arg(long)]
    year: Option<i32>,

    #[arg(long)]
    day: Option<i8>,
}

fn main() {
    let args = Args::parse();

    let all = match (args.all, args.year, args.day) {
        (true, _, _) => true,
        (false, Some(_), _) => false,
        (false, _, Some(_)) => false,
        (false, None, None) => true,
    };

    if all {
        y2023::run_all();
        y2025::run_all();
    } else {
        let year = match args.year {
            Some(year) => year,
            None => chrono::Local::now().year(),
        };

        if year == 2025 {
            y2025::run(args.day);
        } else if year == 2023 {
            y2023::run(args.day);
        }
    }
}
