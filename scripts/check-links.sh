#!/usr/bin/env bash
# SPDX-License-Identifier: Apache-2.0
#
# Offline link check of every Markdown document with lychee (https://github.com/lycheeverse/lychee): relative
# links, referenced files and heading anchors must exist. Remote links (the other repositories, which are
# private during the review, shields.io badges) are not fetched. Usage: scripts/check-links.sh
set -euo pipefail
cd "$(dirname "$0")/.."
command -v lychee >/dev/null 2>&1 || { echo "check-links: lychee is not installed" >&2; exit 2; }
git ls-files -z --cached --others --exclude-standard -- '*.md' |
  xargs -0 lychee --offline --include-fragments --no-progress --root-dir "$PWD" --
