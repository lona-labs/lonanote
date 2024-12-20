#[derive(Clone, Debug)]
pub struct CommandContext {
    args: Option<String>,
}

unsafe impl Send for CommandContext {}

impl CommandContext {
    pub fn new(args: Option<String>) -> Self {
        Self { args }
    }
    pub fn args(&self) -> Option<&String> {
        self.args.as_ref()
    }
}
