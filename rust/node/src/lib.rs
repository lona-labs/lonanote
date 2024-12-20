#![deny(clippy::all)]

use anyhow::Error;
use serde_json::json;

use lonanote_core::{
    context::CommandContext, invoke_command, invoke_command_async, result::CommandResult,
};

#[macro_use]
extern crate napi_derive;

fn get_error_output(err: Error) -> Option<String> {
    let v = json!({
        "error": err.to_string(),
    });
    match serde_json::to_string(&v) {
        Ok(v) => Some(v),
        Err(_) => Some("{{\"error\"=\"err json serialize failed\"}}".to_string()),
    }
}

pub fn parse_invoke_result(res: CommandResult) -> Option<String> {
    match res {
        Ok(res) => match res {
            Some(v) => match serde_json::to_string(&json!({
                "data": v,
            })) {
                Ok(v) => Some(v),
                Err(err) => get_error_output(err.into()),
            },
            None => None,
        },
        Err(err) => get_error_output(err),
    }
}

#[napi]
pub fn invoke(key: String, args: Option<String>) -> Option<String> {
    let res = invoke_command(&key.to_string(), CommandContext::new(args));
    parse_invoke_result(res)
}

#[napi]
pub async fn invoke_async(key: String, args: Option<String>) -> Option<String> {
    let res = invoke_command_async(&key.to_string(), CommandContext::new(args)).await;
    parse_invoke_result(res)
}

#[napi]
pub fn init() -> Option<String> {
    match lonanote_core::init() {
        Ok(_) => None,
        Err(err) => Some(format!("init rust error: {}", err.to_string())),
    }
}
