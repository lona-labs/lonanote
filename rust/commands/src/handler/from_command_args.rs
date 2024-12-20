use anyhow::{anyhow, Result};

use super::super::{body::Json, context::CommandContext};

pub trait FromCommandArgs: Sized {
    fn from_args<'a>(key: &'a str, ctx: &'a CommandContext<'a>) -> Result<Self>;
}

impl<T> FromCommandArgs for Json<T>
where
    T: for<'de> serde::Deserialize<'de>,
{
    fn from_args<'a>(key: &'a str, ctx: &'a CommandContext<'a>) -> Result<Self> {
        match ctx.args() {
            Some(arg) => {
                let input_t = T::deserialize(arg)?;
                Ok(Json(input_t))
            }
            None => Err(anyhow!(
                "expected [JSON] body but no body provided: {}",
                key
            )),
        }
    }
}

impl FromCommandArgs for () {
    fn from_args<'a>(_: &'a str, _: &'a CommandContext<'a>) -> Result<Self> {
        Ok(())
    }
}
