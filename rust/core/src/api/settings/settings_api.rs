use anyhow::Result;
use lonanote_commands::{
    body::Json,
    reg_command_async,
    result::{CommandResponse, CommandResult},
};

use crate::settings::Settings;

async fn get_settings() -> CommandResult {
    let settings = crate::settings::get_settings().await;
    let res = CommandResponse::json(settings.clone())?;

    Ok(res)
}

async fn set_settings(Json(s): Json<Settings>) -> CommandResult {
    let mut settings = crate::settings::get_settings_mut().await;
    *settings = s;

    Ok(CommandResponse::None)
}

async fn set_settings_and_save(Json(s): Json<Settings>) -> CommandResult {
    let mut settings = crate::settings::get_settings_mut().await;
    *settings = s;
    settings.save()?;

    Ok(CommandResponse::None)
}

async fn save_settings() -> CommandResult {
    let settings = crate::settings::get_settings().await;
    settings.save()?;

    Ok(CommandResponse::None)
}

pub fn reg_commands() -> Result<()> {
    reg_command_async("get_settings", get_settings)?;
    reg_command_async("set_settings", set_settings)?;
    reg_command_async("set_settings_and_save", set_settings_and_save)?;
    reg_command_async("save_settings", save_settings)?;

    Ok(())
}