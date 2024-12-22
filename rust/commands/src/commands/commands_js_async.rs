use anyhow::{anyhow, Result};
use std::sync::{Arc, LazyLock, RwLock};

use super::super::Commands;

type CommandHandlerValueJsAsync =
    Box<dyn Fn(String, bool, Option<fn(Option<String>)>) -> Result<()> + Send + Sync>;

pub type CommandsJsAsync = Commands<String, CommandHandlerValueJsAsync>;

static COMMANDS_JS_ASYNC: LazyLock<Arc<RwLock<CommandsJsAsync>>> =
    LazyLock::new(|| Arc::new(RwLock::new(CommandsJsAsync::new())));

pub fn reg_command_js_async(command: String, handler: CommandHandlerValueJsAsync) -> Result<()> {
    match COMMANDS_JS_ASYNC.write() {
        Ok(mut commands) => {
            commands.reg(command, handler);
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn unreg_command_js_async(command: &String) -> Result<()> {
    match COMMANDS_JS_ASYNC.write() {
        Ok(mut commands) => {
            commands.unreg(command);
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn clear_command_js_async() -> Result<()> {
    match COMMANDS_JS_ASYNC.write() {
        Ok(mut commands) => {
            commands.clear();
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn invoke_command_js_async(
    key: &String,
    blocking: bool,
    cb: Option<fn(Option<String>)>,
) -> Result<()> {
    match COMMANDS_JS_ASYNC.write() {
        Ok(commands) => {
            if let Some(cmd) = commands.get(key) {
                cmd(key.to_string(), blocking, cb)
            } else {
                Err(anyhow!("async command not found: {}", key))
            }
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
