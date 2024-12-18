use log::info;
use tauri::{command, Builder, Runtime};

#[command]
pub fn hello_command(args: Vec<String>) -> Vec<String> {
    println!("[hello_command]");
    args
}

pub fn reg_commands<R: Runtime>(builder: Builder<R>) -> Builder<R> {
    info!("register commands...");
    let builder = builder.invoke_handler(tauri::generate_handler![hello_command,]);
    info!("register commands finish!");
    builder
}
