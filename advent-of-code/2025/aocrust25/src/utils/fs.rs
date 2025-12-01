use std::path::PathBuf;

pub fn read(day: i8) -> std::io::Result<String> {
    let path = PathBuf::from(format!("./data/{day}.txt"));
    std::fs::read_to_string(path)
}
