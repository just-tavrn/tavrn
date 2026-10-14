# Roadmap

tavrn is built in phases. Every phase ends with something usable, and the order was chosen so that the
decisions that affect everything (identity, message format, encryption) were settled first. Phases 0 to 5 are
done and phase 6 is in progress; tavrn is pre-release software before its first stable release. There are no
dates here: things ship when they are ready and tested.

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

LiveKit supervised inside the image, voice channels with bitrate and user limits, mute and deafen, screen sharing
and webcams with a tile view, end-to-end encrypted media with frame keys from MLS, the soundboard, graceful
reconnects, ICE over TCP and an embedded TURN server, and a connection test. Voice and video settings (noise
suppression, push-to-talk, background blur), calls in DMs and group DMs, profiles with animated avatars and
presence (also across nodes, reported by the client to every node it has a session on), message requests from
non-friends, a shared end-to-end encrypted whiteboard, and a polish round (context menus, moving members between
channels, notifications, upload categories, spoilers, link previews, files channels, history for new members of
encrypted channels, attachment encryption at rest on the node).

### Phase 5: Platform maturity

Applications and bots with scopes, add links and a consent screen, "no bots" zones, commands, incoming webhooks
(including sealed, write-only webhooks for encrypted channels), outgoing event subscriptions, the bot runtime
and an example bot; single sign-on with OpenID Connect and group mapping; search (on the node for plaintext
channels, a local encrypted index for encrypted ones); announcement and forum channel kinds; the node admin
interface and a `doctor` command for operators; per-user and per-room limits; optional Valkey to run one node
as several instances; legal tooling (takedown notices, legal pages, terms acceptance, data export and account
deletion) and a WCAG 2.2 AA accessibility audit with automated checks.

Finished as part of phase 5 after the split: **threads** in text channels and **forum posts** with titles, tags
and sorting; **web push notifications** through the home node; **reports with evidence**, a moderation inbox and
**content rules for plaintext channels** (word lists, link filters) next to the metadata-based auto-moderation;
**room ownership transfer** (also offered when an owner deletes their account); and **command interactions kept
in Valkey**, so a pending bot interaction survives the restart of the instance that took it when a node runs as
several instances.

After phase 5 the project was split into its public repositories (see the [README](../README.md#repositories)).

## In progress

### Phase 6: Desktop and mobile apps

Native apps built from the same web code base. The desktop app for Windows (a Tauri shell) and Linux (an Electron
shell) and the Android app exist, macOS builds are experimental; iOS follows.

Done so far in the desktop app:

- **The app itself**: a Tauri shell for Windows (`.msi`, NSIS installer) that bundles the web client instead of loading
  it from a node, updates itself from signed releases through an update channel of its choice (stable, or beta with
  the pre-releases) and publishes a checksum file for every installer.
- **The Electron shell for Linux**: the same client in Chromium, so voice, video, screen sharing (the shell's own
  picker, the PipeWire portal on Wayland), the soundboard and the background effects work as in the browser; the OS
  keychain through the desktop's keyring, the tray, native notifications, downloads, global hotkeys with the Tauri
  app's key listener, a hardened shell (sandboxed renderer, a checked bridge, Electron's fuses), its own updater, and CI
  with a full smoke test of the AppImage. It takes over the home node of an installed Tauri app. Its `.AppImage` and
  `.deb` replaced the Tauri Linux bundles in the releases, passkeys work on FIDO2 security keys in the app, and a
  Windows build of it is attached as a fallback for computers where WebView2 causes trouble.
- **Signing in through the node's own page** (node picker, handoff to a sign-in window or the system browser), so
  passkeys, single sign-on and captchas work in the app, and **unlocking with a passkey**: the node's page seals the
  passkey's unlock material to the app, which the node can store but never open.
- **The OS keychain** for the key of the local key store (Secret Service on Linux, Credential Manager on Windows),
  with a visible fallback when no keychain answers; native notifications, a tray icon with the voice state and close
  to tray.
- **Global hotkeys** for push-to-talk, the priority speaker, mute and deafen, one binding each, also a modifier key
  alone; the keys are observed, never taken away from the game that has the focus.
- **A native voice engine** in the Tauri app on LiveKit's Rust SDK: always in its Linux bundles (where the webview has
  no WebRTC), as an experimental setting on Windows; audio only, encrypted with the same frame keys as in the browser.
  A prototype of video in this engine showed that every video feature would have to be built twice, which led to the
  Electron shell for Linux; the prototype is archived, its measurements are kept in tavrn-web's desktop documentation.
- **Downloads** through the native save dialog, with "Show in folder".
- **Links into the app** (`tavrn://` invites, rooms and add links of applications), and an opt-in **game activity**
  that shows "Playing <game>" for the games of an editable list, never window titles or other programs.
- **macOS builds (experimental)**: one universal app for Apple Silicon and Intel, not signed with an Apple Developer
  ID yet; they wait for a contributor with a Mac to verify them.

Done so far in the Android app (`org.tavrn.app`, Android 8 and newer, an APK on every release): the same client with
push through UnifiedPush (no Google services), voice in the background with a notification, an audio output switch,
the front and back camera, screen sharing of the whole screen, unlocking with fingerprint, face or PIN through
Android's keystore, passkeys in the app on nodes that accept its origin, `tavrn://` links and downloads.

Done in the same cycle in the protocol, the node and the clients:

- **Age assurance, first slice**: a date of birth at registration, the node's minimum age (16 by default), a private
  age status, adults-only rooms and channels, and a signed "over 18" claim between nodes instead of the date.
- **End-to-end encrypted files channels** by default (chosen when the channel is created).
- **History**: restore of encrypted history after a key reset by request and approval, history for members who open
  a channel only later (`since_join` without gaps), and history shares sealed to each recipient device (share
  format 2, with a share key per device attested by the device key).
- **Permissions and visibility**: layered permissions with a channel-scoped set of bits and overrides for single
  members; members who cannot view a channel no longer receive its events, notification hints or pushes, and room
  details hide such channels; members can be moved into voice channels they could not join or see on their own.
- **Security reviews**: two rounds of an authorization audit and two rounds of an end-to-end encryption review, with
  every finding fixed and covered by regression tests (among them signed context for replies and threads, the refusal
  of stale MLS epochs, a "key changed" state for ghost members and a per-user rate limit).
- **Social and client**: friends see which voice channel a friend is in and can join it, a hover card and voice and
  streaming badges in the room rail, room invites from the friend and member menus, marks for channels a member
  cannot enter and for private channels, the allowed file types per role and channel in the permission editors, a
  warning before downloading executables, context menus that stay open while toggling, rail folders, voice quick
  menus and a screen wake lock during calls.
- **Operators**: localized mails (English and German, replaceable templates), expiry notices for tokens, message
  retention, live reload of auto-moderation rules and push notifications for new reports; a container image for
  `linux/amd64` and `linux/arm64`, so a node runs natively on ARM servers; files channels that keep their files
  only on external WebDAV or S3 stores, with a limit per store; and **reports across nodes**: a report about a user
  of another node can be forwarded to that user's home node, whose admins are the ones able to act on the account.
- **Polls and date polls** in channels, threads and DMs: single or multiple choice, or days and times answered yes,
  maybe or no; questions, options and votes end-to-end encrypted in encrypted conversations, votes as signed records
  next to the poll, an optional close time, and a *Create polls* permission.
- **Voice**: a session timer and a status line in the voice header (with its own permission), "Mute for you" for a
  single participant on your device, a hint when you talk while muted, dragging yourself into another voice channel,
  screen shares that are joined on demand with a choice of the sound to share, the whiteboard as a tile of its own,
  and new join, leave and ring sounds.
- **View the room as a role**: room managers preview the channels, actions and settings a role gets, as a read-only
  simulation on their device.
- **Passkeys and encryption**: every passkey says whether it unlocks the encrypted messages, and "Enable message
  unlock" adds that to a passkey added later or whose authenticator reports the needed extension only when used.
- **Profiles** (avatars, names, bios) reach other nodes within seconds after a change.

Next in phase 6:

- A decision on the native engine as the default on Windows after measurements on real hardware.
- Signed and notarized macOS builds, verified on real Macs.
- The Android app in app stores, and the **iOS app** with native push notifications and voice that keeps running
  with the display off.
- The **local activity bridge**: with the user's consent, a local program (such as a game) can set the user's
  activity; the interface is already specified and mocked in the web client.
- The local search index without the browser's size budget.

Native apps also narrow the inherent limit of browser-based encryption, where the web client is code served by a
node: the desktop app runs only the client it was installed with.

## Planned

### Phase 7: Account resilience

Keeping an account usable when its home node fails, without turning accounts into a multi-master system:

- **Account export and migration** to another node with a signed redirect, so friends and rooms follow.
- **Replica nodes**: a user picks up to two nodes (whose operators allow it) that receive a copy of the account
  data (profile, friends, conversation index, devices and public keys, the encrypted key backup). They may act
  for the account only while the home node is unreachable, and hand the changes back when it returns.
- Client failover to the first reachable replica.

Encryption is untouched by this: keys stay with the user, and replicas see only what the home node sees.

### Also planned

- **Age assurance beyond the self-declared date of birth**: verification through pluggable providers, node
  policies and federated claims that other nodes can trust.

## Open ideas

Smaller items that are agreed in principle but not scheduled:

- **Resumable uploads** for very large files: upload sessions with fixed-size parts that survive a lost
  connection or a reload (and an app restart in the native apps).
- **Attachments for bots and sealed webhooks**: files in posts that bots and write-only webhooks make in
  encrypted channels.
- **Encrypted room metadata** for private rooms (low priority): role, channel and category names and topics
  encrypted for the members, optional per room.
- Offline reading of the history a device keeps locally, client plugins, cross-posting of announcements between
  rooms, and S3-compatible storage for attachments (files channels can already keep their files on WebDAV or
  S3-compatible storage).
