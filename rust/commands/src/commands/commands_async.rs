use anyhow::{anyhow, Result};
use std::{
    collections::HashMap,
    future::Future,
    pin::Pin,
    sync::{Arc, LazyLock},
};

use super::super::{context::CommandContext, handler::CommandHandlerAsync, result::CommandResult};

use tokio::sync::RwLock;

type CommandHandlerResultAsync<'a> = Pin<Box<dyn Future<Output = CommandResult> + Send + 'a>>;

type CommandHandlerValueAsync =
    Box<dyn for<'b> Fn(&'b str, CommandContext<'b>) -> CommandHandlerResultAsync<'b> + Send + Sync>;

struct CommandsAsync {
    commands: HashMap<&'static str, CommandHandlerValueAsync>,
}

impl CommandsAsync {
    pub fn new() -> Self {
        Self {
            commands: HashMap::new(),
        }
    }
    pub fn reg<T, H>(&mut self, command: &'static str, f: H)
    where
        H: CommandHandlerAsync<T> + Send + Sync + 'static,
    {
        let f = std::sync::Arc::new(f);
        let wrapped_fn =
            for<'b> move |key: &'b str,
                          ctx: CommandContext<'b>|
                          -> Pin<Box<dyn Future<Output = CommandResult> + Send + 'b>> {
                let f = std::sync::Arc::clone(&f);
                Box::pin(async move {
                    let f = f.call(key, ctx);
                    f.await
                })
            };
        self.commands.insert(command, Box::new(wrapped_fn));
    }
    pub fn unreg(&mut self, command: &'static str) {
        if self.commands.contains_key(command) {
            self.commands.remove(command);
        }
    }
    pub fn clear(&mut self) {
        self.commands.clear();
    }
    pub fn get_command(&self, key: &str) -> Option<&CommandHandlerValueAsync> {
        self.commands.get(key)
    }
}

static COMMANDS_ASYNC: LazyLock<Arc<RwLock<CommandsAsync>>> =
    LazyLock::new(|| Arc::new(RwLock::new(CommandsAsync::new())));

pub fn reg_command_async<T, H>(command: &'static str, handler: H) -> Result<()>
where
    H: CommandHandlerAsync<T> + Send + Sync + 'static,
{
    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let mut commands = COMMANDS_ASYNC.write().await;
        commands.reg(command, handler);
    });
    // COMMANDS_ASYNC
    //     .write()
    //     .unwrap()
    //     .reg(command, handler);

    Ok(())
}
pub fn unreg_command_async(command: &'static str) -> Result<()> {
    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let mut commands = COMMANDS_ASYNC.write().await;
        commands.unreg(command);
    });
    Ok(())
}
pub fn clear_command_async() -> Result<()> {
    let rt = tokio::runtime::Runtime::new()?;
    rt.block_on(async {
        let mut commands = COMMANDS_ASYNC.write().await;
        commands.clear();
    });
    Ok(())
}
pub async fn invoke_command_async<'a>(key: &str, ctx: CommandContext<'a>) -> CommandResult {
    let commands = COMMANDS_ASYNC.read().await;
    // let commands = COMMANDS_ASYNC.read().unwrap();
    if let Some(cmd) = commands.get_command(key) {
        cmd(key, ctx).await
    } else {
        Err(anyhow!("async command not found: {}", key))
    }
}
