use anyhow::{anyhow, Result};
use lonanote_core::{
    context::CommandContext, invoke_command, invoke_command_async, result::CommandResult,
};
use tauri::{
    command,
    ipc::{InvokeBody, Request, Response},
};

fn parse_invoke_args<'a>(request: &'a Request<'a>) -> Result<(String, CommandContext<'a>)> {
    let key = request.headers().get("key");
    match key {
        Some(k) => {
            let k = k.to_str().unwrap_or("");
            let args = if let InvokeBody::Json(data) = request.body() {
                match data.get("args") {
                    Some(args) => Some(args),
                    None => None,
                }
            } else {
                None
            };
            Ok((k.to_string(), CommandContext::new(args)))
        }
        None => Err(anyhow!("error invoke, notfound headers[key]")),
    }
}

pub fn parse_to_invoke_result(res: CommandResult) -> Result<Response> {
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
pub fn invoke(request: Request<'_>) -> Result<Response, String> {
    match parse_invoke_args(&request) {
        Ok((k, ctx)) => {
            let res = invoke_command(&k, ctx);
            parse_to_invoke_result(res).map_err(|e| e.to_string())
        }
        Err(err) => Err(err.to_string()),
    }
}

#[command]
pub async fn invoke_async<'a>(request: Request<'a>) -> Result<Response, String> {
    match parse_invoke_args(&request) {
        Ok((k, ctx)) => {
            let res = invoke_command_async(&k, ctx).await;
            parse_to_invoke_result(res).map_err(|e| e.to_string())
        }
        Err(err) => Err(err.to_string()),
    }
}
