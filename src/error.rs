use anyhow::Result;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum BumperError {
    #[error("Git command failed: {0}")]
    GitError(String),

    #[error("File not found: {0}")]
    FileNotFound(String),

    #[error("Invalid version format: {0}")]
    InvalidVersion(String),

    #[error("Configuration error: {0}")]
    ConfigError(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),

    #[error("JSON error: {0}")]
    JsonError(#[from] serde_json::Error),
}

pub type BumperResult<T> = Result<T, BumperError>;
