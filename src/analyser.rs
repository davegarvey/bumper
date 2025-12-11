use crate::config::Config;
use regex::Regex;

const BUMP_COMMIT_PREFIX: &str = "chore: bump version";

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum BumpType {
    Major,
    Minor,
    Patch,
    None,
}

impl BumpType {
    pub fn as_str(&self) -> &'static str {
        match self {
            BumpType::Major => "major",
            BumpType::Minor => "minor",
            BumpType::Patch => "patch",
            BumpType::None => "none",
        }
    }

    pub fn label(&self) -> &'static str {
        match self {
            BumpType::Major => "Major",
            BumpType::Minor => "Minor",
            BumpType::Patch => "Patch",
            BumpType::None => "None",
        }
    }

    pub fn max(&self, other: BumpType) -> BumpType {
        match (self, other) {
            (BumpType::Major, _) | (_, BumpType::Major) => BumpType::Major,
            (BumpType::Minor, _) | (_, BumpType::Minor) => BumpType::Minor,
            (BumpType::Patch, _) | (_, BumpType::Patch) => BumpType::Patch,
            _ => BumpType::None,
        }
    }
}

pub struct AnalysisResult {
    pub bump: BumpType,
    pub triggering_commits: Vec<String>,
    pub unknown_commits: Vec<String>,
}

pub fn analyse_commits(commits: &[String], config: &Config) -> AnalysisResult {
    let substantive_commits: Vec<_> = commits
        .iter()
        .filter(|msg| !msg.starts_with(BUMP_COMMIT_PREFIX))
        .collect();

    if substantive_commits.is_empty() {
        return AnalysisResult {
            bump: BumpType::None,
            triggering_commits: vec![],
            unknown_commits: vec![],
        };
    }

    let mut bump = BumpType::None;
    let mut triggering_commits = Vec::new();
    let mut unknown_commits = Vec::new();

    let commit_type_regex = Regex::new(r"^([a-z]+)(?:\([^)]+\))?(!?):").unwrap();

    for msg in substantive_commits {
        if let Some(captures) = commit_type_regex.captures(msg) {
            let commit_type = captures.get(1).map(|m| m.as_str()).unwrap_or("");
            let has_exclamation = captures.get(2).map(|m| m.as_str()).unwrap_or("") == "!";

            let has_breaking = has_exclamation || msg.to_lowercase().contains("breaking change");

            let commit_bump = if has_breaking {
                BumpType::Major
            } else if let Some(bump_str) = config.types.get(commit_type) {
                match bump_str.as_str() {
                    "major" => BumpType::Major,
                    "minor" => BumpType::Minor,
                    "patch" => BumpType::Patch,
                    _ => BumpType::None,
                }
            } else {
                unknown_commits.push(msg.to_string());
                BumpType::None
            };

            bump = bump.max(commit_bump);

            if commit_bump != BumpType::None {
                triggering_commits.push(format!("{}: {}", commit_bump.label(), msg));
            }
        }
    }

    AnalysisResult {
        bump,
        triggering_commits,
        unknown_commits,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bump_type_max() {
        assert_eq!(BumpType::Major.max(BumpType::Minor), BumpType::Major);
        assert_eq!(BumpType::Minor.max(BumpType::Patch), BumpType::Minor);
        assert_eq!(BumpType::Patch.max(BumpType::None), BumpType::Patch);
    }

    #[test]
    fn test_analyse_commits_feat() {
        let commits = vec!["feat: add new feature".to_string()];
        let config = Config::default();
        let result = analyse_commits(&commits, &config);

        assert_eq!(result.bump, BumpType::Minor);
    }

    #[test]
    fn test_analyse_commits_fix() {
        let commits = vec!["fix: resolve bug".to_string()];
        let config = Config::default();
        let result = analyse_commits(&commits, &config);

        assert_eq!(result.bump, BumpType::Patch);
    }

    #[test]
    fn test_analyse_commits_breaking() {
        let commits = vec!["feat!: breaking change".to_string()];
        let config = Config::default();
        let result = analyse_commits(&commits, &config);

        assert_eq!(result.bump, BumpType::Major);
    }
}
