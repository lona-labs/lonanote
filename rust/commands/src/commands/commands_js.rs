use anyhow::{anyhow, Result};
use std::{
    future::Future,
    pin::Pin,
    sync::{Arc, LazyLock},
};
use tokio::sync::RwLock;

use super::super::Commands;

pub type CommandHandlerValueJsResult = Pin<Box<dyn Future<Output = Result<Option<String>>> + Send>>;

pub type CommandHandlerValueJs =
    Box<dyn Fn(Option<String>) -> CommandHandlerValueJsResult + Send + Sync>;

pub type CommandsJsSync = Commands<String, CommandHandlerValueJs>;

static COMMANDS_JS: LazyLock<Arc<RwLock<CommandsJsSync>>> =
    LazyLock::new(|| Arc::new(RwLock::new(CommandsJsSync::new())));

pub fn reg_command_js(command: String, handler: CommandHandlerValueJs) -> Result<()> {
    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let mut commands = COMMANDS_JS.write().await;
        commands.reg(command, handler);
    });

    Ok(())
}
pub fn unreg_command_js(command: &String) -> Result<()> {
    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let mut commands = COMMANDS_JS.write().await;
        commands.unreg(&command);
    });
    Ok(())
}
pub fn clear_command_js() -> Result<()> {
    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let mut commands = COMMANDS_JS.write().await;
        commands.clear();
    });
    Ok(())
}
pub async fn invoke_command_js(
    key: impl AsRef<str>,
    args: Option<String>,
) -> Result<Option<String>> {
    let commands = COMMANDS_JS.read().await;
    let k = key.as_ref().to_string();
    if let Some(cmd) = commands.get(&k) {
        cmd(args).await
    } else {
        Err(anyhow!("async command not found: {}", k,))
    }
}
