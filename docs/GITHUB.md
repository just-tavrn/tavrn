# GitHub setup of tavrn (umbrella repository)

What this repository expects on GitHub and what the owner switches on by hand. The repository starts private;
nothing runs on GitHub until `CI_ENABLED` is set. The organization-wide steps (members, Actions policy, tokens,
runners, code security) are in the [`.github` repository's GitHub guide](https://github.com/just-tavrn/.github/blob/main/docs/GITHUB.md).

## Already set (through `gh api` when the repository was created)

- Private; default branch `main`; squash merges allowed, branches deleted after merge.
- Issues on, **Discussions on**, wiki off, projects off.
- Labels from `scripts/github-labels.sh`: the common set plus `scripts/labels.txt` (rerun it after editing the list; it is idempotent).

## Variables (Settings → Secrets and variables → Actions → Variables)

| Variable | Value | Effect |
|---|---|---|
| `CI_ENABLED` | `true` | Every job of every workflow is gated by it (`docs.yml`: Markdown lint, offline link check, SPDX headers, shellcheck, publication hygiene, the organization's gitleaks workflow; `cla.yml`). Unset or any other value: nothing runs. |

## Secrets

| Secret | Scope | Used by |
|---|---|---|
| `PUBLISH_CHECK_PRIVATE` | repository, as an **Actions secret and a Dependabot secret** (`gh secret set PUBLISH_CHECK_PRIVATE -R just-tavrn/tavrn` and the same with `--app dependabot`; Dependabot's pull requests see only Dependabot secrets) | `docs.yml` (job `publish-check`): comma-separated private domains, hosts and addresses that must never appear in the tree. Without it the check fails on purpose, except on Dependabot's pull requests: there the workflow sets `PUBLISH_CHECK_ALLOW_UNCONFIGURED=1`, the private-pattern step is skipped with a warning and every other step still runs; the push to `main` runs the full check. Locally the same list lives in an untracked `.publish-check.private` (in the repository or its parent directory). |
| `CLA_PAT` | organization (as a repository secret while private, Free plan) | `cla.yml`: fine-grained token with Contents read and write on `just-tavrn/cla-signatures`. |

## Discussions: the organization's central place

This repository is meant to hold the **central Discussions of the organization**: the README, the FAQ, the issue
chooser and the contributing pointer all link `https://github.com/just-tavrn/tavrn/discussions`. Discussions are
enabled through the API; the categories are created by hand (Settings → General → Features → Discussions → Set up
discussions, then the pencil next to "Categories"):

| Category | Format | Who may post | Purpose |
|---|---|---|---|
| **Announcements** | Announcement | maintainers only | Releases, pointers to security advisories, project news |
| **Q&A** | Question and answer (answers can be marked) | everyone | Help with running a node, using the client, building bots |
| **Ideas** | Open-ended discussion | everyone | Feature ideas before they become issues in a code repository |
| **Show and tell** | Open-ended discussion | everyone | Nodes, bots, clients and integrations people built |
| **Protocol** | Open-ended discussion | everyone | Early design discussions about the protocol; agreed changes become issues in tavrn-protocol |

Delete the default categories that are not in the list ("General", "Polls") or keep "General" if you prefer a
catch-all. Pin a welcome post in Announcements that links the README, the FAQ and the code of conduct.

**Once public**: organization Settings → **Discussions** → **Enable discussions for this organization** with
**`just-tavrn/tavrn`** as the source repository, so the organization's Discussions tab shows these. The
organization profile, `CONTRIBUTING.md`, `SUPPORT.md` and the issue choosers of every repository already link
here; Discussions of the `.github` repository are switched off at the same time, so there is only one place.

## Settings to switch on by hand

- **Private vulnerability reporting** is not needed here (documentation only; `SECURITY.md` points to the code
  repositories), but harmless to enable once public.
- **Secret scanning and push protection** (Settings → Code security; free for public repositories).
- **Dependabot alerts** (Settings → Code security). `dependabot.yml` asks for weekly, grouped updates of the
  workflow actions; it is not gated by `CI_ENABLED`. To keep it quiet during the private phase, pause it under
  Insights → Dependency graph → Dependabot.
- **Actions permissions**: the workflows use `actions/checkout`, `actions/setup-node`, `npx markdownlint-cli2`
  (from npm), a checksum-pinned `lychee` release binary, and the organization's reusable workflows
  (`just-tavrn/.github`: gitleaks, CLA). While `just-tavrn/.github` is private its Settings → Actions → General →
  Access must be "Accessible from repositories in the just-tavrn organization".
- **Team** `@just-tavrn/maintainers` must exist for `CODEOWNERS` to work.
- **Social preview** (Settings → General → Social preview): upload `assets/logo.png` (or a 1280×640 banner made
  from it) once public.
- **Once the repository is public** (branch protection and rulesets are not available on private repositories of
  the Free organization plan): protect `main` with a ruleset: pull request required, one approving review from
  `@just-tavrn/maintainers`, required checks `Markdown lint, links, SPDX headers, shellcheck`,
  `Publication hygiene`, `Secret scan (gitleaks)` and `Contributor license agreement`, linear history, no force
  pushes, no deletions.

## Documentation website

The documents under `docs/` are written so that they can later become the source of the project website
(tavrn.org): plain Markdown, relative links, Mermaid diagrams. Nothing is published through GitHub Pages yet.

## Local checks

```sh
scripts/check-links.sh       # offline link check (needs lychee)
npx markdownlint-cli2        # Markdown lint (configuration in .markdownlint-cli2.jsonc)
scripts/check-spdx.sh        # SPDX headers of scripts
scripts/publish-check.sh     # no private files, domains or secrets (needs the private pattern list)
```
