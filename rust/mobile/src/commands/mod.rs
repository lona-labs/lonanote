mod invoke;

use anyhow::Result;
use invoke::*;
use tauri::{Builder, Runtime};

pub fn reg_commands<R: Runtime>(builder: Builder<R>) -> Builder<R> {
    builder.invoke_handler(tauri::generate_handler![invoke, invoke_async])
}

pub fn init_commands() -> Result<()> {
    lonanote_core::init()?;
    Ok(())
}
