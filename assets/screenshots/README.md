# Screenshots

The PNG files here are made by [`make.ts`](make.ts), a Playwright script that drives the web client of a local
development node with fictitious demo accounts (Mira Okafor, Jonas Berg, Lena Park, Theo Laurent) in the room
"Night Owls Gaming". Everything shown is created by the script; the node's domain is `localhost`. The demo
accounts register through the normal wizard, including the date of birth every registration asks for (an adult
date, so the node's minimum age `TAVRN_MINIMUM_AGE` and adults-only rooms never get in the way). The gallery is
[docs/screenshots.md](../../docs/screenshots.md).

## Making them again

The script runs from a checkout of [tavrn-web](https://github.com/just-tavrn/tavrn-web) (it needs its
Playwright installation) against a node from [tavrn-node](https://github.com/just-tavrn/tavrn-node). It starts
nothing itself.

1. Start a fresh development node on port 8700 with an empty database, voice enabled and `mira` as node admin
   (the first account; `livekit-server` must be on the `PATH` for voice):

   ```sh
   TAVRN_DOMAIN=localhost TAVRN_LISTEN=127.0.0.1:8700 \
   TAVRN_DATABASE_URL="sqlite:///tmp/tavrn-demo/demo.db?mode=rwc" TAVRN_DATA_DIR=/tmp/tavrn-demo/data \
   TAVRN_ADMIN_USERS=mira TAVRN_REGISTRATION=open TAVRN_ROOM_CREATION=local \
   TAVRN_WEBAUTHN_ORIGIN=http://localhost:5700 \
   TAVRN_LIVEKIT_PORT=9700 TAVRN_RTC_UDP_PORT_RANGE=50000-50149 TAVRN_RTC_TCP_PORT=10700 \
   TAVRN_RTC_EXTERNAL_IP=<this machine's address> \
   tavrn-node --dev
   ```

2. Start the web client's development server against it on port 5700, in tavrn-web:
   `E2E_NODE_PORT=8700 E2E_WEB_PORT=5700 pnpm --filter @tavrn/web dev`.
3. Copy `make.ts` and `playwright.config.ts` into a new directory `e2e/shots/` of tavrn-web and run
   `SHOTS_OUT=<this directory> npx playwright test -c shots/playwright.config.ts` from `e2e/`
   (`SHOTS_NODE_PORT` and `SHOTS_WEB_PORT` override the ports 8700 and 5700).
4. Check the images, optimize them if `pngquant` or `oxipng` is installed (the script tries both), keep each file
   under 400 KB, and commit them. The demo node can be thrown away afterwards.

`ffmpeg` (optional) draws the arena map, the room icon and the fake camera picture; without it the script uses
plain placeholders and Chromium's test pattern.

The screenshots are CC-BY-4.0 like the other documents of this repository; the tavrn logo visible in them stays
a trademark of the project ([TRADEMARK.md](../../TRADEMARK.md)).
