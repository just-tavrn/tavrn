# Roadmap

tavrn is built in phases. Every phase ends with something usable, and the order was chosen so that the
decisions that affect everything (identity, message format, encryption) were settled first. Phases 0 to 5 are
done; the project is in private review before its first public release. There are no dates here: things ship
when they are ready and tested.

Ideas and wishes are welcome in [Discussions](https://github.com/just-tavrn/tavrn/discussions) (category
"Ideas"); concrete feature requests go to the repository that owns the code.

## Done

### Phase 0: Foundation

The protocol document (identities, addresses, capabilities, the message envelope), the OpenAPI skeleton, the
data model, the container build, the design tokens and the responsive base layout for phone, tablet and
desktop, and a test infrastructure on every level (Rust tests against a real database, unit tests for the
TypeScript packages, browser tests with Playwright) with the first real tests.

### Phase 1: Text chat on a single node

Accounts with invites, optional captcha and e-mail confirmation, password reset; rooms with categories,
channels, roles and permission overrides; invites, kick, ban and timeout; messages with Markdown, editing,
attachments within node limits, reactions, pins, custom emojis and optional GIF search; auto-moderation, bulk
deletion with a preview, an audit log; realtime over WebSocket; room, user and node administration in the web
client; English and German.

### Phase 2: End-to-end encryption

The encryption core (Rust, OpenMLS, compiled to WebAssembly), device keys signed by the user's identity key,
MLS groups for channels, DMs and group DMs, encrypted attachments, the history backup for new devices and the
identity reset. A mandatory second factor (TOTP or passkeys, with recovery codes) for every password account,
and the master secret wrapped on the home node under a recovery key or a passkey's PRF output, never under a
password. Friends and blocks, "security key changed" notices, ghost member warnings, lazy history loading with
unread and mention counts.

### Phase 3: Federation

Discovery through `/.well-known/tavrn`, node signing keys with rotation, federation tokens and federated
sessions, joining rooms on other nodes, the conversation index on the home node, friends and DMs across nodes,
invite delivery, node blocklists and domain bans, the decentralized node directory with "Discover", signing in
with an account of another node, conformance checks against peers, safety numbers and QR verification, and
device signatures on plaintext messages. Later in the cycle: delegation of an identity domain to another host
and a DNS record fallback.

### Phase 4: Voice, video, profiles and the whiteboard

LiveKit supervised inside the image, voice channels with bitrate and user limits, mute and deafen, screen
sharing and webcams with a tile view, end-to-end encrypted media with frame keys from MLS, the soundboard,
graceful reconnects, ICE over TCP and an embedded TURN server, and a connection test. Voice and video settings
(noise suppression, push-to-talk, background blur), calls in DMs and group DMs, profiles with animated avatars
and presence, message requests from non-friends, a shared end-to-end encrypted whiteboard, and a polish round
(context menus, moving members between channels, notifications, upload categories, spoilers, link previews,
files channels, history for new members of encrypted channels, attachment encryption at rest on the node).

### Phase 5: Platform maturity

Applications and bots with scopes, add links and a consent screen, "no bots" zones, commands, incoming webhooks
(including sealed, write-only webhooks for encrypted channels), outgoing event subscriptions, the bot runtime
and an example bot; single sign-on with OpenID Connect and group mapping; search (on the node for plaintext
channels, a local encrypted index for encrypted ones); announcement and forum channel kinds; the node admin
interface and a `doctor` command for operators; per-user and per-room limits; optional Valkey to run one node
as several instances; legal tooling (takedown notices, legal pages, terms acceptance, data export and account
deletion) and a WCAG 2.2 AA accessibility audit with automated checks.

After phase 5 the project was split into its public repositories (see the [README](../README.md#repositories)),
which are now in review.

## Planned

### Phase 6: Desktop and mobile apps

Native apps built with Tauri from the same web code base: Windows, macOS and Linux first, then Android and iOS.

- The encryption core runs natively; device keys go into the operating system's keychain.
- **Global hotkeys** on the desktop (push-to-talk, priority speaker, mute, deafen) that work while the app is in
  the background.
- **Native push notifications** on mobile.
- The **local activity bridge**: with the user's consent, a local program (such as a game) can set the
  user's activity; the interface is already specified and mocked in the web client.
- The local search index without the browser's size budget.

Native apps also narrow the inherent limit of browser-based encryption, where the web client is code served
by a node.

### Phase 7: Account resilience

Keeping an account usable when its home node fails, without turning accounts into a multi-master system:

- **Account export and migration** to another node with a signed redirect, so friends and rooms follow.
- **Replica nodes**: a user picks up to two nodes (whose operators allow it) that receive a copy of the account
  data (profile, friends, conversation index, devices and public keys, the encrypted key backup). They may act
  for the account only while the home node is unreachable, and hand the changes back when it returns.
- Client failover to the first reachable replica.

Encryption is untouched by this: keys stay with the user, and replicas see only what the home node sees.

## Open ideas

Smaller items that are agreed in principle but not scheduled:

- **Resumable uploads** for very large files: upload sessions with fixed-size parts that survive a lost
  connection or a reload (and an app restart in the native apps).
- **Room ownership transfer**, so an owner can hand a room over (today owners delete their rooms before they
  delete their account).
- **Command interactions through Valkey**, so a pending bot interaction survives the restart of the instance
  that holds it when a node runs as several instances.
- **Attachments for bots and sealed webhooks**: files in posts that bots and write-only webhooks make in
  encrypted channels.
- **Threads and forum posts**: posts with titles, tags and sorting in forum channels, threads in text
  channels (the message format already reserves the field).
- **Web push notifications** through the home node (the push hint between nodes is already specified).
- **Content rules for plaintext channels** (word lists, link filters) next to the metadata-based
  auto-moderation, and message reports with evidence.
- Offline reading of the history a device keeps locally, client plugins, presence across nodes, cross-posting
  of announcements between rooms, and S3-compatible storage for attachments.
