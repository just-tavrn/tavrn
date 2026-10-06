#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0
#
# Creates (or updates) the issue and pull-request labels of this repository: the common set of the tavrn
# repositories plus `question`, `roadmap` and `github-actions` (used by Dependabot).
# Usage: scripts/github-labels.sh [owner/repo ...]   (default: just-tavrn/tavrn)
# Needs the GitHub CLI (`gh`) authenticated with write access to the repositories. Safe to run again:
# existing labels get the colour and description below.
set -euo pipefail

repos=("$@")
[ ${#repos[@]} -eq 0 ] && repos=("just-tavrn/tavrn")

# name|colour|description
labels=(
  "bug|d73a4a|Something does not work as described"
  "enhancement|a2eeef|New feature or improvement"
  "security|b60205|Security relevant (vulnerabilities are reported privately, see SECURITY.md)"
  "protocol|5319e7|Touches the protocol: API, message format, federation or encryption"
  "needs-triage|fbca04|Not yet looked at by a maintainer"
  "good first issue|7057ff|A good place to start contributing"
  "help wanted|008672|Maintainers would welcome a contribution"
  "documentation|0075ca|Documentation only"
  "breaking-change|e11d21|Changes existing behaviour, the API, the configuration or a storage format"
  "dependencies|0366d6|Dependency updates"
  "github-actions|000000|Updates of the GitHub Actions workflows"
  "question|d876e3|A question about the project (usage questions go to Discussions)"
  "roadmap|1d76db|Concerns the roadmap or the phase plan"
)

for repo in "${repos[@]}"; do
  for entry in "${labels[@]}"; do
    IFS='|' read -r name color description <<< "$entry"
    gh label create "$name" --repo "$repo" --color "$color" --description "$description" --force
  done
  echo "labels of $repo up to date"
done
