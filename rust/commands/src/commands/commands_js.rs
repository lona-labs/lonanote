use anyhow::{anyhow, Result};
use std::sync::{Arc, LazyLock, RwLock};

use super::super::Commands;

type CommandHandlerValueJs =
    Box<dyn Fn(String, bool, Option<fn(Option<String>)>) -> Result<()> + Send + Sync>;

pub type CommandsJsSync = Commands<String, CommandHandlerValueJs>;

static COMMANDS_JS: LazyLock<Arc<RwLock<CommandsJsSync>>> =
    LazyLock::new(|| Arc::new(RwLock::new(CommandsJsSync::new())));

pub fn reg_command_js(command: String, handler: CommandHandlerValueJs) -> Result<()> {
    match COMMANDS_JS.write() {
        Ok(mut commands) => {
            commands.reg(command, handler);
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn unreg_command_js(command: &String) -> Result<()> {
    match COMMANDS_JS.write() {
        Ok(mut commands) => {
            commands.unreg(command);
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn clear_command_js() -> Result<()> {
    match COMMANDS_JS.write() {
        Ok(mut commands) => {
            commands.clear();
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn invoke_command_js(
    key: impl AsRef<str>,
    blocking: bool,
    cb: Option<fn(Option<String>)>,
) -> Result<()> {
    match COMMANDS_JS.write() {
        Ok(commands) => {
            let k = key.as_ref().to_string();
            if let Some(cmd) = commands.get(&k) {
                cmd(k, blocking, cb)
            } else {
                Err(anyhow!("async command not found: {}", k,))
            }
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
