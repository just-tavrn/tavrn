# Frequently asked questions

Honest answers, including the limits. If your question is missing, ask in
[Discussions](https://github.com/just-tavrn/tavrn/discussions) (category "Q&A").

## Are rooms replicated across nodes?

No. Some federated chat systems replicate a room to every server that has a member in it, and the servers resolve
conflicts in a shared event graph. In tavrn **a room lives on exactly one node**. Users of other
nodes connect to that node directly with a short-lived token from their home node; nodes only exchange signed
notifications (invites, friend requests, "you have a new DM"). This is much simpler and faster, and it keeps the
data of a room in one place. The trade-off: when a node is offline, its rooms are offline until it returns,
exactly as with a centrally hosted community. Your account, friends and the rooms on other nodes keep working.

## Can the operator of a node read my messages?

Not in encrypted conversations, which are the default: channels, DMs, group DMs, attachments and calls are
end-to-end encrypted with MLS, and the keys stay on your devices. The operator does see **metadata**: who is in
which room and conversation, who writes when, whom a message mentions (so the node can notify), file sizes, and
your profile. Room admins can switch individual text, announcement or forum channels to **plaintext** (for
example for very large public channels or server-side search); then every client shows a permanent banner that
the operator can read along. Files channels (shared folders) are end-to-end encrypted by default as well: file
names, folder names and contents are encrypted on your devices, and the node stores ciphertext and sees only sizes,
times and the shape of the folder tree. A room admin can create a files channel without end-to-end encryption
instead (the choice is fixed when the channel is created); such a channel shows a permanent banner, too.

One limit applies to every browser-based end-to-end encryption: the web client is code that a node serves. A
malicious operator could serve a modified client. The desktop app, which runs only the client it was installed
with, and reproducible builds narrow this. Details: [architecture](architecture.md#end-to-end-encryption) and the threat model in
[`ENCRYPTION.md`](https://github.com/just-tavrn/tavrn-protocol/blob/main/ENCRYPTION.md) §11.

## How do bots work with encryption?

A bot is an account with an owner and its own keys. In an encrypted channel it reads and writes only as a
regular, visible MLS member: it carries a BOT badge, and the channel's security log tells everyone when a bot
joins or leaves. Room admins can declare **"no bots" zones**; new rooms keep their encrypted channels closed to
bots unless a channel explicitly allows them, because a bot token is a single factor. **Webhooks** can post into
encrypted channels **write-only**: the post is sealed to a key that only the members can derive, so neither the
webhook nor (in the default mode) the node can read it. See
[`APPLICATIONS.md`](https://github.com/just-tavrn/tavrn-protocol/blob/main/APPLICATIONS.md).

## Is there a central server?

No. There is no central service, directory or web client. Every node serves the web client, so you can open any
node in a browser and sign in with your own address; the client finds your home node through its
`/.well-known/tavrn`. Nodes find each other through reference nodes they are configured with and the signed
announcements of their peers. The project may run a public node of its own one day, but it will be one node
among others, without special rights.

## Can I use my own domain?

Yes, that is the normal case: the domain of your node is part of every address on it (`alice@example.org`). The
node does not even have to run on that host: with delegation, `example.org` serves a small discovery document
(or a DNS record) that points to the host running the node, for example `chat.example.org`. Choose the identity
domain with care; addresses cannot be renamed.

## Why does registration ask for my date of birth?

Every node has a minimum age for registration (16 by default, set by the operator), and rooms and channels can be
marked adults-only. The date of birth is your own statement, not a verification. It stays on your home node and is
never shown to other users, room admins or other nodes: the node derives a private age status from it (adult or
minor), and other nodes learn only a signed "18 or older: yes or no" from your home node when you use them. You
enter it once; the operator of your node can correct it on request. The details are in
[`PROTOCOL.md`](https://github.com/just-tavrn/tavrn-protocol/blob/main/PROTOCOL.md) §5e.

## What happens if I lose my key?

Your encryption keys are protected by a **recovery key** (24 words, shown once at registration) and optionally a
passkey that supports the PRF extension. A new device or a cleared browser gets everything back with either of
them. If you lose every way back (all your devices, the recovery key and every such passkey), you can still sign
in with your password and second factor and **reset your identity**: you keep your account, friends, rooms and
DMs, but the old encrypted history is lost, and your contacts see that your security key changed. Nobody, not
even the operator, can recover encrypted history for you; that is the point of end-to-end encryption.

## What if my home node shuts down?

Today your account lives on its home node, and rooms live on their nodes. Account export and migration to
another node, and later replica nodes that can stand in while the home node is down, are planned (see the
[roadmap](roadmap.md)). Until then, choose a node whose operator you trust to keep it running, or run
your own.

## Why are there several licenses?

Each part has the license that fits its role ([repository map](../README.md#repositories)):

- the **node** is **AGPL-3.0-only**, so improvements of a hosted node stay open;
- the **web client, the SDK and the bot runtime** are **Apache-2.0**, so anyone can build clients, bots and
  integrations, open or not;
- the **encryption core and `@tavrn/e2ee`** are **MPL-2.0**, a file-level copyleft: you can embed them anywhere,
  but changes to the encryption itself are published;
- the **protocol** is **Apache-2.0** for the machine-readable parts and **CC-BY-4.0** for the prose, so other
  implementations can use it freely.

## Why is there a CLA?

Contributors sign a short [contributor license agreement](https://github.com/just-tavrn/.github/blob/main/CLA.md)
once, by commenting on their first pull request. You keep the copyright of your work; the agreement lets the
project offer additional licenses next to the open-source ones (for example to a company that cannot accept the
AGPL). It comes with a written promise: everything published under an open-source license stays available under
it, and tavrn keeps being published under its open-source licenses. No DCO sign-off is needed.

## May I host tavrn and call it tavrn?

For yourself, your community, your company or your friends: yes, with the unmodified name and logo, also with
your own configuration, theme and local patches. Distributing a **modified** version under the name, or running a
**hosting business** under the name "tavrn", needs permission. The details and examples are in
[TRADEMARK.md](../TRADEMARK.md). The code licenses are not affected: you may always run, change and share the
software; only the name and the logo are protected.

## Is tavrn accessible?

The web client targets **WCAG 2.2 level AA**: everything works with the keyboard, dialogs trap and return focus,
new messages are announced to screen readers (and can be muted), contrast and target sizes meet the criteria, and
reduced motion is respected. Automated checks run on phone, tablet and desktop layouts and fail on serious
violations. The audit is not finished (a full manual screen reader walkthrough is still open), so if something
does not work for you, please tell us: accessibility problems are bugs.

## Which apps are there?

The web client, which every node serves and which works on phones, tablets and desktops (it is responsive from the
start), and the **desktop app for Linux and Windows**, built with Tauri from the same code. The app brings global
hotkeys for push-to-talk, mute and deafen that work while a game has the focus, the OS keychain for your local keys,
native notifications and a tray icon, signing in and unlocking with a passkey through your node's page, and on Linux
a native voice engine. A macOS app and mobile apps for Android and iOS (with native push notifications) come next;
see the [roadmap](roadmap.md).

## Is it production-ready?

Not yet. tavrn is before its first public release, and the encryption code has **not been audited** yet. It
builds on OpenMLS and well-known RustCrypto crates instead of primitives of its own and is tested against shared
reference vectors, but treat it as pre-release software until the first stable release.

## How can I contribute?

Read the organization's [contributing guide](https://github.com/just-tavrn/.github/blob/main/CONTRIBUTING.md) and
[code of conduct](https://github.com/just-tavrn/.github/blob/main/CODE_OF_CONDUCT.md). Bug reports, fixes,
translations, documentation, protocol reviews and accessibility testing are all welcome. Issues belong in the
repository that owns the code; changes to the wire format start in
[tavrn-protocol](https://github.com/just-tavrn/tavrn-protocol). For this repository's documents, open a pull
request or an issue of the kind "documentation". Security problems are reported privately as the
[security policy](https://github.com/just-tavrn/.github/blob/main/SECURITY.md) describes.
