# Screenshots

The web client on a local demo node: a fictitious room "Night Owls Gaming" with four demo accounts, dark theme,
English locale. Desktop screenshots are 1440×900, phone screenshots 390×844. How they are made:
[assets/screenshots/README.md](../assets/screenshots/README.md).

## Chat

An end-to-end encrypted text channel: Markdown, an image attachment, a code block, a spoiler, a reply and
reactions; the member list grouped by roles on the right.

![A text channel with formatted messages, an image, a code block, a hidden spoiler, a reply and reactions](../assets/screenshots/chat-desktop.png)

<p align="center"><img src="../assets/screenshots/chat-phone.png" alt="The same channel on a phone" width="300"></p>

## Voice and video

A voice channel with three participants and a camera, end-to-end encrypted with keys from the channel's MLS
group ("End-to-end encrypted" in the header). The channel list shows who is in which voice channel.

![The voice stage with a camera tile and two avatar tiles](../assets/screenshots/voice-desktop.png)

<p align="center"><img src="../assets/screenshots/voice-phone.png" alt="The voice stage on a phone" width="300"></p>

## Search

Search in encrypted channels runs on a local, encrypted index on the device; the status line says honestly what
was searched.

![The search panel with three results from an encrypted channel and the status line](../assets/screenshots/search-desktop.png)

## Roles and permissions

The role editor of the room settings: hierarchy, colour, "show separately" and the permission switches.

![The role editor with the Moderator role selected](../assets/screenshots/roles-desktop.png)

## Files channel

A shared folder tree per channel. Files channels are never end-to-end encrypted, and the client says so
permanently.

![A files channel with folders and files and the banner that files are not end-to-end encrypted](../assets/screenshots/files-desktop.png)

## Security settings

The mandatory second factor (authenticator app, passkeys), recovery codes, the recovery key and the security key.

![The security settings with an authenticator app, a passkey that can unlock messages, recovery codes and the encryption section](../assets/screenshots/security-desktop.png)

## Adding a bot

The consent screen of an application's add link: who owns the bot, the permissions it asks for, the upper bound
of its tokens, and a plain notice that a bot reads the encrypted channels it can view.

![The consent screen for adding the bot Raid Planner to a room](../assets/screenshots/consent-desktop.png)

## Node administration

The overview of the node admin page with the effective configuration.

![The node administration overview with counters and the effective configuration](../assets/screenshots/admin-desktop.png)
