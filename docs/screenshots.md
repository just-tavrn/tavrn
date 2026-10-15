# Screenshots

The web client on a local demo node: a fictitious room "Night Owls Gaming" with five demo accounts, dark theme,
English locale. The pictures come from the website's screenshot pipeline ([tavrn.org](https://tavrn.org)); desktop
screenshots are 1440×900, phone screenshots 390×844. How they are made:
[assets/screenshots/README.md](../assets/screenshots/README.md).

## Chat

An end-to-end encrypted text channel: Markdown, a pinned message with an image and a thread, a code block, a
spoiler, a reply and reactions; the member list grouped by roles on the right.

![A text channel with a pinned welcome message carrying an image and a thread, a code block, a hidden spoiler, a reply and reactions, and the member list grouped by roles](../assets/screenshots/chat-desktop.png)

<p align="center"><img src="../assets/screenshots/chat-phone.png" alt="The same channel on a phone" width="300"></p>

## Voice and video

A voice channel with four participants, a shared screen and a camera, end-to-end encrypted with keys from the
channel's MLS group ("End-to-end encrypted" in the header). The channel list shows who is in which voice channel.

![The voice stage with a shared screen, a camera tile and two avatar tiles](../assets/screenshots/voice-desktop.png)

<p align="center"><img src="../assets/screenshots/voice-phone.png" alt="The voice stage on a phone" width="300"></p>

## Polls

A poll in an encrypted channel after voting: result bars with counts, shares and voters, your own vote marked, and
**Change vote**. Date polls show their results as a compact grid of days and times. Votes in encrypted channels are
encrypted too.

![A poll in the encrypted channel raid-strategy with four options, result bars, the voters and the own vote marked](../assets/screenshots/poll-desktop.png)

## Search

Search in encrypted channels runs on a local, encrypted index on the device; the status line says honestly what
was searched.

![The search panel with three results from an encrypted channel and the status line](../assets/screenshots/search-desktop.png)

## Roles and permissions

The role editor of the room settings: hierarchy, colour, "show separately" and the permission switches.

![The role editor with the Moderator role selected](../assets/screenshots/roles-desktop.png)

## Files channel

A shared folder tree per channel, with uploads, previews and a storage meter. Files channels are end-to-end
encrypted by default: names, folder names and contents are encrypted on the devices, and search runs on the local
index. A channel created without encryption gets a permanent banner saying so.

![A files channel with the folders Clips, Guides and Maps, six files with their sizes and uploaders, and the storage meter](../assets/screenshots/files-desktop.png)

## Security settings

The mandatory second factor (authenticator app, passkeys), recovery codes, the recovery key and the security key.

![The security settings with an active authenticator app, a passkey that can also unlock messages, and the recovery codes](../assets/screenshots/security-desktop.png)

## Adding a bot

The consent screen of an application's add link: who owns the bot, the permissions it asks for, the upper bound
of its tokens, and a plain notice that a bot reads the encrypted channels it can view.

![The consent screen for adding the bot Raid Planner to a room](../assets/screenshots/consent-desktop.png)

## Buttons and forms of bots

Bots can add buttons, select menus and forms to their messages; the client draws them with its own controls. An
answer can be visible to the person who clicked alone ("Only you can see this").

![A message of the bot Raid Planner with an embed, buttons, a link button and an open select menu, and an answer only the viewer sees](../assets/screenshots/components-desktop.png)

## Node administration

The overview of the node admin page with the effective configuration.

![The node administration overview with counters and the effective configuration](../assets/screenshots/admin-desktop.png)
