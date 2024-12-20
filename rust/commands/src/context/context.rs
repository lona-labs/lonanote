use serde_json::Value;

#[derive(Clone, Debug)]
pub struct CommandContext<'a> {
    args: Option<&'a Value>,
}

unsafe impl Send for CommandContext<'_> {}

impl<'a> CommandContext<'a> {
    pub fn new(args: Option<&'a Value>) -> Self {
        Self { args }
    }
    pub fn args(&self) -> Option<&Value> {
        self.args
    }
}
