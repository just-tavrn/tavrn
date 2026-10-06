# Security

Please **do not report security vulnerabilities in public issues, discussions or pull requests.**

This repository contains documentation only. Report vulnerabilities privately in the repository of the affected
component (its **Security** tab → **Report a vulnerability**), as described in the organization's
[security policy](https://github.com/just-tavrn/.github/blob/main/SECURITY.md):

| Component | Report in |
|---|---|
| Node server, container image, deployment files | [tavrn-node](https://github.com/just-tavrn/tavrn-node/security/advisories/new) |
| Web client (and later the desktop and mobile apps) | [tavrn-web](https://github.com/just-tavrn/tavrn-web/security/advisories/new) |
| Encryption core, `@tavrn/crypto` | [tavrn-crypto](https://github.com/just-tavrn/tavrn-crypto/security/advisories/new) |
| `@tavrn/sdk`, `@tavrn/e2ee`, `@tavrn/bot` | [tavrn-js](https://github.com/just-tavrn/tavrn-js/security/advisories/new) |
| A flaw in the protocol or the encryption design itself | [tavrn-protocol](https://github.com/just-tavrn/tavrn-protocol/security/advisories/new) |

If a document here describes a security property wrongly (for example what a node can or cannot see), that is
worth a private report too: report it in tavrn-protocol, which is the authoritative description.
