agent: agent
---

Evaluate the current changed files in the repository.

1. Analyse changes:
- Identify logical groupings of changes (for example feature, fix, refactor, config, docs, tests).
- Separate unrelated changes into distinct commit groups.
- Detect any breaking changes (API behaviour changes, removed functions, incompatible config changes).

Definitions for commit types:
- feat: Adds new user-facing behaviour or capability.
- fix: Corrects incorrect behaviour, errors, failures or bugs.
- refactor: Changes internal code structure without altering behaviour, features or interfaces.
- docs: Changes only documentation (including README, API docs, comments that explain behaviour).
- test: Adds, updates or removes tests without changing production code.
- chore: Routine internal maintenance that does not affect application logic (for example dependency bumps, CI workflows, formatting, codegen output).
- config: Changes to configuration files or environment setup (for example build configs, lint configs, application settings) that do not change application logic.

Breaking changes:
A change is breaking if it alters public behaviour or interfaces in a way that requires user action. Examples include:
- Modifying or removing an exported function, method or class.
- Changing input or output formats.
- Altering required configuration keys.
- Changing default behaviour in a non-backwards-compatible way.

2. Prepare commits:
- For each group, stage only the files belonging to that group.
- Generate a commit message following Conventional Commits:
  - Use the appropriate type (feat, fix, refactor, docs, chore, test, config).
  - Add "!" after the type or type+scope when the change is breaking, or include a "BREAKING CHANGE:" footer describing the impact.
  - Keep the subject line concise (≤72 characters), factual and imperative.
  - Include an optional body describing what changed and why.
  - Reference issues or tickets if relevant.

3. Perform commit:
- For each commit group:
  - Stage the files for that group.
  - Commit with the generated message.

Project must pass linting and tests before staging and committing.
Do not push changes to the remote repository.
Do not combine unrelated changes into a single commit.
Do not modify the content of the changes; only group, stage and commit with message.
