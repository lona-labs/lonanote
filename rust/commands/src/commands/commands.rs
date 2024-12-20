use anyhow::{anyhow, Result};
use std::{
    collections::HashMap,
    ops::Deref,
    sync::{Arc, LazyLock, RwLock},
};

use super::super::{context::CommandContext, handler::CommandHandler, result::CommandResult};

type CommandHandlerValue = Box<dyn Fn(&str, CommandContext) -> CommandResult + Send + Sync>;

pub struct Commands {
    commands: HashMap<&'static str, CommandHandlerValue>,
}
impl Commands {
    pub fn new() -> Self {
        Self {
            commands: HashMap::new(),
        }
    }
    pub fn reg<T, H>(&mut self, command: &'static str, f: H)
    where
        H: CommandHandler<T>,
    {
        let wrapped_fn =
            move |key: &str, ctx: CommandContext| -> CommandResult { f.call(key, ctx) };
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
    pub fn get(&self, key: &str) -> Option<&CommandHandlerValue> {
        return self.commands.get(key);
    }
}

impl Deref for Commands {
    type Target = HashMap<&'static str, CommandHandlerValue>;
    fn deref(&self) -> &Self::Target {
        &self.commands
    }
}

static COMMANDS: LazyLock<Arc<RwLock<Commands>>> =
    LazyLock::new(|| Arc::new(RwLock::new(Commands::new())));

pub fn reg_command<T, H>(command: &'static str, handler: H) -> Result<()>
where
    H: CommandHandler<T>,
{
    match COMMANDS.write() {
        Ok(mut commands) => {
            commands.reg(command, handler);
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn unreg_command(command: &'static str) -> Result<()> {
    match COMMANDS.write() {
        Ok(mut commands) => {
            commands.unreg(command);
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn clear_command() -> Result<()> {
    match COMMANDS.write() {
        Ok(mut commands) => {
            commands.clear();
            Ok(())
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
pub fn invoke_command(key: &str, ctx: CommandContext) -> CommandResult {
    match COMMANDS.write() {
        Ok(commands) => {
            if let Some(cmd) = commands.get(key) {
                cmd(key, ctx)
            } else {
                Err(anyhow!("async command not found: {}", key))
            }
        }
        Err(err) => Err(anyhow!(err.to_string())),
    }
}
