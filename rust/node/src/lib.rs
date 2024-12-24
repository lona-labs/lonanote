#![deny(clippy::all)]

use napi::{
    bindgen_prelude::*,
    threadsafe_function::{ErrorStrategy, ThreadsafeFunction},
};

use lonanote_core::{
    context::CommandContext, invoke_command, invoke_command_async, result::CommandResult,
};

#[macro_use]
extern crate napi_derive;

pub fn parse_invoke_result(res: CommandResult) -> Result<Option<String>> {
    let res = res.map_err(|e| napi::Error::from_reason(e.to_string()))?;
    Ok(res)
}

#[napi]
pub fn invoke(key: String, args: Option<String>) -> Result<Option<String>> {
    let res = invoke_command(&key.to_string(), CommandContext::new(args));
    parse_invoke_result(res)
}

#[napi]
pub async fn invoke_async(key: String, args: Option<String>) -> Result<Option<String>> {
    let res = invoke_command_async(&key.to_string(), CommandContext::new(args)).await;
    parse_invoke_result(res)
}

#[napi(
    ts_args_type = "key: string, callback: (args: string | null | undefined) => Promise<string | null | undefined>"
)]
pub fn reg_js_function(key: String, callback: JsFunction) -> Result<()> {
    let tsfn: ThreadsafeFunction<Option<String>, ErrorStrategy::Fatal> = callback
        .create_threadsafe_function(0, |ctx| match ctx.value {
            Some(v) => ctx.env.create_string_from_std(v).map(|v| vec![Some(v)]),
            None => Ok(vec![None]),
        })?;
    let wrapped_fn = move |args: Option<String>| -> lonanote_core::CommandHandlerValueJsResult {
        let f = tsfn.clone();
        Box::pin(async move {
            let r: Promise<Option<String>> = f.call_async(args).await?;
            let r = r.await?;
            Ok(r)
        })
    };
    lonanote_core::reg_command_js(key, Box::new(wrapped_fn))
        .map_err(|err| napi::Error::from_reason(err.to_string()))?;
    Ok(())
}

#[napi(ts_args_type = "key: string")]
pub fn unreg_js_function(key: String) -> Result<()> {
    lonanote_core::unreg_command_js(&key)
        .map_err(|err| napi::Error::from_reason(err.to_string()))?;
    Ok(())
}

#[napi]
pub fn clear_js_function() -> Result<()> {
    lonanote_core::clear_command_js().map_err(|err| napi::Error::from_reason(err.to_string()))?;
    Ok(())
}

#[napi]
pub async fn test_rust_call() -> Result<()> {
    let ret: Option<String> =
        lonanote_core::invoke_command_js_lazy("test_func", Some("args1".to_string()))
            .await
            .map_err(|err| napi::Error::from_reason(err.to_string()))?;
    println!("test_rust_call: {:?}", ret);
    Ok(())
}

#[napi]
pub fn init() -> Option<String> {
    match lonanote_core::init() {
        Ok(_) => None,
        Err(err) => Some(format!("init rust error: {}", err.to_string())),
    }
}
