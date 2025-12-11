use crate::config::Config;
use crate::error::BumperResult;
use crate::git::get_last_tag;
use crate::strategy::Strategy;
use crate::versioner::Version;

pub struct GitStrategy {
    config: Config,
}

impl GitStrategy {
    pub fn new(config: Config) -> Self {
        GitStrategy { config }
    }
}

impl Strategy for GitStrategy {
    fn get_current_version(&self) -> BumperResult<Version> {
        let last_tag = get_last_tag()?;
        
        if let Some(tag) = last_tag {
            let prefix = &self.config.tag_prefix;
            let version_str = if tag.starts_with(prefix) {
                &tag[prefix.len()..]
            } else {
                &tag
            };
            
            Version::parse(version_str)
        } else {
            Ok(Version {
                major: 0,
                minor: 0,
                patch: 0,
            })
        }
    }
    
    fn update_files(&self, _new_version: &Version) -> BumperResult<Vec<String>> {
        // Git strategy doesn't update any files
        Ok(vec![])
    }
}
