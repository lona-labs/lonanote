use anyhow::Result;
use log::info;

use lonanote_commands::{
    body::Json,
    reg_command,
    result::{CommandResult, CommandResultUtility},
};

pub fn hello_command(Json(args): Json<Vec<String>>) -> CommandResult {
    println!("[hello_command]");

    CommandResult::json(args.clone())
}

pub fn reg_commands() -> Result<()> {
    info!("register commands...");
    reg_command("hello_command", hello_command)?;
    info!("register commands finish!");

    Ok(())
}
