#![deny(clippy::all)]

use napi::{bindgen_prelude::*, threadsafe_function::*, *};

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

    let f = std::sync::Arc::new(tsfn);

    let wrapped_fn = move |args: Option<String>| -> lonanote_core::CommandHandlerValueJsResult {
        let f = std::sync::Arc::clone(&f);
        Box::pin(async move {
            let _r: Result<JsUnknown> = f.call_async(args).await;
            // let f = f.call(key, args);
            // f.await
            Ok(None)
        })
    };

    // let f = move |args: String, blocking: bool, cb: Option<fn(Option<String>)>| {
    //     let mode = if blocking {
    //         ThreadsafeFunctionCallMode::Blocking
    //     } else {
    //         ThreadsafeFunctionCallMode::NonBlocking
    //     };
    //     if let Some(cb) = cb {
    //         tsfn.call_with_return_value(args, mode, move |ret: JsUnknown| {
    //             let t = ret.get_type()?;
    //             if t == ValueType::String {
    //                 let s: JsString = ret.coerce_to_string()?;
    //                 let rs_str = s.into_utf8()?.into_owned()?;
    //                 cb(Some(rs_str));
    //                 Ok(())
    //             } else {
    //                 cb(None);
    //                 Ok(())
    //             }
    //         });
    //     } else {
    //         tsfn.call(args, mode);
    //     }
    //     Ok(())
    // };
    // let wrapper_fn = Box::new(f);
    lonanote_core::reg_command_js(key, Box::new(wrapped_fn))
        .map_err(|err| napi::Error::from_reason(err.to_string()))?;
    Ok(())

    // let f = std::sync::Arc::new(handler);
    // let wrapped_fn = move |key: String, args: Option<String>| -> CommandHandlerValueJsResult {
    //     let f = std::sync::Arc::clone(&f);
    //     Box::pin(async move {
    //         let f = f.call(key, args);
    //         f.await
    //     })
    // };
    // commands.reg(command, Box::new(wrapped_fn));
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
    let ret = lonanote_core::invoke_command_js("test_func", Some("args1".to_string()))
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
