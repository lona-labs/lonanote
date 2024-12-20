use anyhow::{anyhow, Result};

use serde::Serialize;
use serde_json::Value;

pub type CommandResult = Result<Option<Value>>;

pub trait CommandResultUtility {
    fn json<T>(data: T) -> Self
    where
        T: Serialize;
}

impl CommandResultUtility for CommandResult {
    fn json<T>(data: T) -> Self
    where
        T: Serialize,
    {
        match serde_json::to_value(data) {
            Ok(r) => Ok(Some(r)),
            Err(err) => Err(anyhow!(err)),
        }
    }
}
