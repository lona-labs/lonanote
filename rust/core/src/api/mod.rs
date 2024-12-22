use anyhow::Result;
use log::info;

use lonanote_commands::{
    body::Json,
    reg_command, reg_command_async,
    result::{CommandResult, CommandResultUtility},
};

pub fn hello_command(Json(args): Json<Vec<String>>) -> CommandResult {
    println!("[hello_command]");

    CommandResult::json(args.clone())
}

pub async fn hello_command_async(Json(args): Json<Vec<String>>) -> CommandResult {
    tokio::time::sleep(std::time::Duration::from_secs(1)).await;
    println!("[hello_command]");

    CommandResult::json(args.clone())
}

pub fn reg_commands() -> Result<()> {
    info!("register commands...");
    reg_command("hello_command", hello_command)?;
    reg_command_async("hello_command_async", hello_command_async)?;
    info!("register commands finish!");

    Ok(())
}
