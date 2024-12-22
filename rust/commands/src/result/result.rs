use anyhow::Result;

use serde::Serialize;

pub type CommandResult = Result<Option<String>>;

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
        match serde_json::to_string(&data) {
            Ok(r) => Ok(Some(r)),
            Err(err) => Err(err.into()),
        }
    }
}
