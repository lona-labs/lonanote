use async_trait::async_trait;
use std::future::Future;

use super::super::{body::NoArgsBody, context::CommandContext, result::CommandResult};
use super::from_command_args::FromCommandArgs;

#[async_trait]
pub trait CommandHandlerAsync<T>: Send + Sync + 'static {
    async fn call(&self, key: &str, ctx: CommandContext) -> CommandResult;
}

macro_rules! impl_command_handler_async {
    // 有参数
    ([$($arg:ident),*]) => {
        #[async_trait]
        impl<F, Fut, $($arg),*> CommandHandlerAsync<($($arg),*)> for F
        where
            F: Fn($($arg),*) -> Fut + Send + Sync + 'static,
            Fut: Future<Output = CommandResult> + Send,
            $(
                $arg: FromCommandArgs + Send,
            )*
        {
            async fn call(&self, key: & str, ctx: CommandContext) -> CommandResult {
                (self)($(<$arg>::from_args(key, &ctx)?),*).await
            }
        }
    };
    // 一个参数
    ($arg:ident) => {
        #[async_trait]
        impl<F, Fut, $arg> CommandHandlerAsync<$arg> for F
        where
            F: Fn($arg) -> Fut + Send + Sync + 'static,
            Fut: Future<Output = CommandResult> + Send,
            $arg: FromCommandArgs + Send,
        {
            async fn call(&self, key: & str, ctx: CommandContext) -> CommandResult {
                (self)(<$arg>::from_args(key, &ctx)?).await
            }
        }
    };
    // 无参
    () => {
        #[async_trait]
        impl<F, Fut> CommandHandlerAsync<NoArgsBody> for F
        where
            F: Fn() -> Fut + Send + Sync + 'static,
            Fut: Future<Output = CommandResult> + Send,
        {
            async fn call(&self, _: & str, _: CommandContext) -> CommandResult {
                (self)().await
            }
        }
    };
}

impl_command_handler_async!();
impl_command_handler_async!(T);
impl_command_handler_async!([T, T1]);
impl_command_handler_async!([T, T1, T2]);
impl_command_handler_async!([T, T1, T2, T3]);
impl_command_handler_async!([T, T1, T2, T3, T4, T5]);
impl_command_handler_async!([T, T1, T2, T3, T4, T5, T6]);
impl_command_handler_async!([T, T1, T2, T3, T4, T5, T6, T7]);
impl_command_handler_async!([T, T1, T2, T3, T4, T5, T6, T7, T8]);
impl_command_handler_async!([T, T1, T2, T3, T4, T5, T6, T7, T8, T9]);
impl_command_handler_async!([T, T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]);
