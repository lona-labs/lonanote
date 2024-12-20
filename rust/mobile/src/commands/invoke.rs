use anyhow::Result;
use lonanote_core::{
    context::CommandContext, invoke_command, invoke_command_async, result::CommandResult,
};
use tauri::{
    command,
    ipc::{InvokeBody, Response},
};

pub fn parse_invoke_result(res: CommandResult) -> Result<Response> {
    let r = match res {
        Ok(r) => match r {
            Some(json) => Ok(Some(InvokeBody::Json(json))),
            None => Ok(None),
        },
        Err(err) => Err(err),
    };
    match r {
        Ok(res) => match res {
            Some(v) => Ok(Response::new(v)),
            None => Ok(Response::new(InvokeBody::default())),
        },
        Err(err) => Err(err),
    }
}

#[command]
pub fn invoke(key: String, args: Option<String>) -> Result<Response, String> {
    let res = invoke_command(&key.to_string(), CommandContext::new(args));
    parse_invoke_result(res).map_err(|e| e.to_string())
}

#[command]
pub async fn invoke_async(key: String, args: Option<String>) -> Result<Response, String> {
    let res = invoke_command_async(&key.to_string(), CommandContext::new(args)).await;
    parse_invoke_result(res).map_err(|e| e.to_string())
}
