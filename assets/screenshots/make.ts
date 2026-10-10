// SPDX-License-Identifier: Apache-2.0
//
// Creates the screenshots in assets/screenshots/ against a local development node with fictitious demo accounts.
// How to run it: see assets/screenshots/README.md. It is a Playwright "test" only to reuse the runner; it asserts
// just enough to know the screens are ready before they are captured.
import { execFileSync } from "node:child_process";
import { createHmac } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { expect, test, type Browser, type Page } from "@playwright/test";

const NODE = `http://127.0.0.1:${process.env.SHOTS_NODE_PORT ?? "8700"}`;
const OUT = resolve(process.env.SHOTS_OUT ?? "screenshots");
const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 390, height: 844 };
// Registration asks for the date of birth (protocol PROTOCOL.md §5e, `age.v1`); the demo accounts are adults.
const DATE_OF_BIRTH = "1990-01-01";

// ---- TOTP (RFC 6238), so the demo accounts can finish the mandatory second-factor enrollment ----------------

function base32Decode(input: string): Buffer {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const ch of input.replace(/=+$/, "").toUpperCase()) {
    value = (value << 5) | alphabet.indexOf(ch);
    bits += 5;
    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  return Buffer.from(out);
}

function totp(secret: string): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(Date.now() / 30_000)));
  const mac = createHmac("sha1", base32Decode(secret)).update(counter).digest();
  const offset = mac[mac.length - 1]! & 0x0f;
  return ((mac.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).toString().padStart(6, "0");
}

// ---- Demo accounts ------------------------------------------------------------------------------------------

interface Demo {
  page: Page;
  username: string;
  password: string;
  token: string;
}

/** Registers through the wizard (English UI): account with date of birth, TOTP, recovery codes, recovery key. */
async function register(browser: Browser, username: string, displayName: string): Promise<Demo> {
  const context = await browser.newContext({ viewport: DESKTOP, locale: "en-US", colorScheme: "dark", permissions: ["microphone", "camera"] });
  const page = await context.newPage();
  const password = `demo-${username}-correct-horse-battery`;
  await page.goto("/login");
  await page.getByRole("tab", { name: "Register" }).click();
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Repeat password", { exact: true }).fill(password);
  await page.getByLabel("Date of birth", { exact: true }).fill(DATE_OF_BIRTH);
  await page.getByLabel("Display name (optional)", { exact: true }).fill(displayName);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { name: "Set up a second factor" })).toBeVisible({ timeout: 30_000 });
  await page.getByTestId("choose-totp").click();
  const secret = (await page.getByTestId("totp-secret").textContent())!.trim();
  await page.getByLabel("6-digit code", { exact: true }).fill(totp(secret));
  await page.getByRole("button", { name: "Activate", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your recovery codes" })).toBeVisible();
  await page.getByLabel("I have saved these codes in a safe place", { exact: true }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByTestId("recovery-key-words")).toBeVisible();
  await page.getByLabel("I have saved my recovery key", { exact: true }).check();
  await page.getByRole("button", { name: "Finish setup", exact: true }).click();
  await expect(page.getByTestId("app-shell")).toBeVisible({ timeout: 30_000 });
  const token = await page.evaluate(() => JSON.parse(localStorage.getItem("tavrn.auth") ?? "{}").token as string);
  return { page, username, password, token };
}

async function api(page: Page, method: "GET" | "POST" | "PATCH" | "PUT", path: string, token: string, data?: unknown) {
  const resp = await page.request.fetch(`${NODE}/api/v1${path}`, { method, headers: { Authorization: `Bearer ${token}` }, data });
  if (!resp.ok()) throw new Error(`${method} ${path}: ${resp.status()} ${await resp.text()}`);
  const text = await resp.text();
  return text ? JSON.parse(text) : null;
}

async function send(page: Page, text: string) {
  const box = page.getByLabel("Message", { exact: true });
  await expect(box).toBeEnabled({ timeout: 30_000 });
  await box.fill(text);
  await page.keyboard.press("Enter");
  await expect(box).toHaveValue("", { timeout: 20_000 });
}

const message = (page: Page, text: string) => page.getByTestId("message").filter({ hasText: text }).last();

async function react(page: Page, text: string, emoji: string) {
  const m = message(page, text);
  await m.hover();
  await m.getByRole("button", { name: "React" }).click();
  await page.getByRole("menuitem", { name: emoji }).first().click();
  await expect(m.getByRole("button", { name: new RegExp(`^${emoji} \\d`) })).toBeVisible();
}

async function reply(page: Page, text: string, answer: string) {
  await message(page, text).click({ button: "right", position: { x: 40, y: 10 } });
  await page.getByRole("menuitem", { name: "Reply" }).click();
  await send(page, answer);
}

async function shot(page: Page, name: string) {
  await page.waitForTimeout(800); // animations and lazy images settle
  const file = join(OUT, `${name}.png`);
  await page.screenshot({ path: file });
  // Optional size optimization when the tools are installed.
  for (const [tool, args] of [["pngquant", ["--force", "--skip-if-larger", "--quality=70-95", "--output", file, file]], ["oxipng", ["-o", "3", "--strip", "safe", file]]] as const) {
    try {
      execFileSync(tool, args as unknown as string[], { stdio: "ignore" });
    } catch {
      /* not installed or nothing gained */
    }
  }
}

/** Renders a PNG (or a Y4M video) with ffmpeg; `null` when ffmpeg is missing. */
function ffmpeg(name: string, args: string[]): Buffer | null {
  const file = join(tmpdir(), `tavrn-shots-${name}`);
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...args, file]);
    return readFileSync(file);
  } catch {
    return null;
  }
}

// 1×1 teal PNG, the fallback without ffmpeg.
const PIXEL = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNgaPj/HwAEhAJ/fH2XnQAAAABJRU5ErkJggg==", "base64");

/** A small tactical "arena map": dark grid, the boss ring in the middle, three spawn points. */
function arenaMap(): Buffer {
  const ring = "lt(abs(hypot(X-160,Y-90)-48),3)";
  const inner = "lt(hypot(X-160,Y-90),15)";
  const grid = "min(1,eq(mod(X,20),0)+eq(mod(Y,20),0))";
  const spawn = "(lt(hypot(X-52,Y-40),7)+lt(hypot(X-268,Y-46),7)+lt(hypot(X-168,Y-158),7))";
  const path = "lt(abs((Y-90)-0.35*(X-160)),2)*lt(abs(X-160),134)*gt(hypot(X-160,Y-90),52)";
  const ch = (s: number, i: number, r: number, p: number, bg: string) => `if(${spawn},${s},if(${inner},${i},if(${ring},${r},if(${path},${p},${bg}))))`;
  const geq = `geq=r='${ch(240, 200, 4, 90, `16+18*${grid}`)}':g='${ch(163, 60, 207, 110, `23+30*${grid}`)}':b='${ch(94, 90, 199, 140, `34+40*${grid}`)}'`;
  return ffmpeg("arena.png", ["-f", "lavfi", "-i", "color=c=0x101722:s=320x180", "-vf", geq, "-frames:v", "1"]) ?? PIXEL;
}

/** A soft, slowly moving gradient as the fake camera (instead of Chromium's green test pattern). */
function cameraVideo(): string | null {
  const file = join(tmpdir(), "tavrn-shots-camera.y4m");
  try {
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-f", "lavfi", "-i", "gradients=s=640x360:r=15:d=6:speed=0.02:c0=0x00427b:c1=0x04cfc7:c2=0x6a3df0:c3=0x101722:nb_colors=4:type=radial:seed=11", "-pix_fmt", "yuv420p", file]);
    return file;
  } catch {
    return null;
  }
}

const camera = cameraVideo();

test.use({
  launchOptions: {
    args: ["--use-fake-device-for-media-stream", "--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required", ...(camera ? [`--use-file-for-fake-video-capture=${camera}`] : [])],
  },
});

test("screenshots", async ({ browser }) => {
  test.setTimeout(600_000);
  mkdirSync(OUT, { recursive: true });

  // The first account is the node admin (TAVRN_ADMIN_USERS=mira).
  const mira = await register(browser, "mira", "Mira Okafor");
  const jonas = await register(browser, "jonas", "Jonas Berg");
  const lena = await register(browser, "lena", "Lena Park");
  const theo = await register(browser, "theo", "Theo Laurent");

  // Room, channels, roles.
  const room = await api(mira.page, "POST", "/rooms", mira.token, { name: "Night Owls Gaming", description: "Late-night co-op, raids and the occasional speedrun.", join_mode: "invite" });
  const icon = ffmpeg("room-icon.png", ["-f", "lavfi", "-i", "gradients=s=256x256:c0=0x6a3df0:c1=0x04cfc7:c2=0x00427b:nb_colors=3:type=radial:seed=7", "-frames:v", "1"]);
  if (icon) {
    const resp = await mira.page.request.put(`${NODE}/api/v1/rooms/${room.id}/icon`, { headers: { Authorization: `Bearer ${mira.token}`, "Content-Type": "image/png" }, data: icon });
    if (!resp.ok()) throw new Error(`room icon: ${resp.status()} ${await resp.text()}`);
  }
  const text = room.channels.find((c: { kind: string }) => c.kind === "text");
  const voice = room.channels.find((c: { kind: string }) => c.kind === "voice");
  await api(mira.page, "PATCH", `/rooms/${room.id}/channels/${text.id}`, mira.token, { name: "general", topic: "Everything that is not a raid" });
  await api(mira.page, "PATCH", `/rooms/${room.id}/channels/${voice.id}`, mira.token, { name: "Lounge" });
  const category = text.category_id ?? null;
  await api(mira.page, "POST", `/rooms/${room.id}/channels`, mira.token, { kind: "announcement", name: "announcements", encrypted: true, category_id: category });
  const strategy = await api(mira.page, "POST", `/rooms/${room.id}/channels`, mira.token, { kind: "text", name: "raid-strategy", encrypted: true, category_id: category });
  await api(mira.page, "POST", `/rooms/${room.id}/channels`, mira.token, { kind: "text", name: "screenshots", encrypted: true, category_id: category });
  const raid = await api(mira.page, "POST", `/rooms/${room.id}/channels`, mira.token, { kind: "voice", name: "Raid Night", category_id: category });
  const files = await api(mira.page, "POST", `/rooms/${room.id}/channels`, mira.token, { kind: "files", name: "shared-files", category_id: category });
  const bit = (n: number) => 1n << BigInt(n);
  const mod = [2, 11, 12, 13, 14, 15, 19, 20, 25].reduce((m, n) => m | bit(n), 0n);
  const lead = [5, 19, 20, 25, 30].reduce((m, n) => m | bit(n), 0n);
  await api(mira.page, "POST", `/rooms/${room.id}/roles`, mira.token, { name: "Night Owl", color: "#9b8cff", hoist: false, permissions: "0", position: 1 });
  const roleLead = await api(mira.page, "POST", `/rooms/${room.id}/roles`, mira.token, { name: "Raid Lead", color: "#f0a35e", hoist: true, permissions: lead.toString(), position: 2 });
  const roleMod = await api(mira.page, "POST", `/rooms/${room.id}/roles`, mira.token, { name: "Moderator", color: "#04cfc7", hoist: true, permissions: mod.toString(), position: 3 });
  for (const member of [jonas, lena, theo]) {
    const invite = await api(mira.page, "POST", `/rooms/${room.id}/invites`, mira.token, {});
    await api(member.page, "POST", `/invites/${invite.code}/join`, member.token, {});
  }
  const users = Object.fromEntries((await api(mira.page, "GET", `/rooms/${room.id}/members`, mira.token)).map((m: { user: { username: string; id: string } }) => [m.user.username, m.user.id]));
  await api(mira.page, "PATCH", `/rooms/${room.id}/members/${users.jonas}`, mira.token, { roles: [roleMod.id] });
  await api(mira.page, "PATCH", `/rooms/${room.id}/members/${users.lena}`, mira.token, { roles: [roleLead.id] });

  // The conversation in #general (end-to-end encrypted: every message is sent through the UI).
  const general = `/rooms/${room.id}/channels/${text.id}`;
  for (const u of [mira, jonas, lena, theo]) {
    await u.page.goto(general);
    await expect(u.page.getByTestId("channel-name")).toHaveText("general");
  }
  await send(mira.page, "Welcome to **Night Owls**! 🦉 Raid night moves to *Friday 21:00* this week.");
  await mira.page.getByLabel("Choose file").setInputFiles({ name: "boss-arena.png", mimeType: "image/png", buffer: arenaMap() });
  await send(mira.page, "Arena layout for Friday, spawn points marked 👇");
  await expect(message(mira.page, "Arena layout").getByTestId("attachment-image").locator("img")).toBeVisible({ timeout: 30_000 });
  await expect(message(lena.page, "Arena layout")).toBeVisible({ timeout: 30_000 });
  await send(lena.page, "Keybind for the dodge in phase one:\n```lua\nbind(\"shift+space\", function() cast(\"blink\") end)\n```");
  await expect(message(theo.page, "Keybind for the dodge")).toBeVisible({ timeout: 30_000 });
  await send(theo.page, "Fair warning: ||the boss has a second phase|| 👀");
  await expect(message(jonas.page, "Fair warning")).toBeVisible({ timeout: 30_000 });
  await reply(jonas.page, "Keybind for the dodge", "That bind saved my run yesterday, thank you!");
  await expect(message(mira.page, "That bind saved")).toBeVisible({ timeout: 30_000 });
  await react(lena.page, "Welcome to", "🔥");
  await react(jonas.page, "Welcome to", "🔥");
  await react(mira.page, "Keybind for the dodge", "❤️");
  await react(mira.page, "second phase", "😂");

  // A few messages in #raid-strategy for the search.
  const strategyUrl = `/rooms/${room.id}/channels/${strategy.id}`;
  await mira.page.goto(strategyUrl);
  await send(mira.page, "Tanks call the pull, healers stack left after the first pull.");
  await send(mira.page, "If we wipe, the next pull is at 21:30 sharp.");
  await lena.page.goto(strategyUrl);
  await send(lena.page, "Pull timer stays at 10 seconds so everyone can buff.");
  await mira.page.reload();
  await expect(message(mira.page, "Pull timer")).toBeVisible({ timeout: 30_000 });

  // Chat view.
  await mira.page.goto(general);
  await expect(message(mira.page, "Arena layout").getByTestId("attachment-image").locator("img")).toBeVisible({ timeout: 30_000 });
  await expect(message(mira.page, "second phase").getByRole("button", { name: /😂 1/ })).toBeVisible();
  await shot(mira.page, "chat-desktop");
  await mira.page.setViewportSize(PHONE);
  await mira.page.reload();
  await expect(message(mira.page, "Arena layout")).toBeVisible({ timeout: 30_000 });
  await shot(mira.page, "chat-phone");
  await mira.page.setViewportSize(DESKTOP);

  // Search (local encrypted index).
  await mira.page.goto(general);
  await expect(message(mira.page, "Welcome to")).toBeVisible({ timeout: 30_000 });
  await mira.page.getByTestId("search-open").click();
  const panel = mira.page.getByTestId("search-panel");
  await panel.getByTestId("search-input").fill("pull");
  await expect(async () => {
    await panel.getByTestId("search-submit").click();
    await expect(panel.getByTestId("search-result")).toHaveCount(3, { timeout: 2_000 });
  }).toPass({ timeout: 60_000 });
  await shot(mira.page, "search-desktop");

  // Voice with a webcam tile.
  const raidUrl = `/rooms/${room.id}/channels/${raid.id}`;
  for (const u of [mira, jonas, lena]) {
    await u.page.goto(raidUrl);
    await u.page.getByTestId("voice-join").click();
    await expect(u.page.getByTestId("voice-stage")).toBeVisible({ timeout: 30_000 });
  }
  await jonas.page.getByTestId("voice-camera").click();
  await expect(mira.page.getByTestId("video-camera").first()).toBeVisible({ timeout: 30_000 });
  await expect(mira.page.getByTestId("voice-tile")).toHaveCount(3, { timeout: 30_000 });
  // Wait until the (decrypted) camera picture actually plays.
  await expect
    .poll(() => mira.page.getByTestId("video-camera").first().evaluate((el) => {
      const v = el instanceof HTMLVideoElement ? el : el.querySelector("video");
      return v ? v.videoWidth > 0 && v.currentTime > 1 : false;
    }), { timeout: 30_000 })
    .toBe(true);
  await mira.page.waitForTimeout(1500);
  await shot(mira.page, "voice-desktop");
  await mira.page.setViewportSize(PHONE);
  await shot(mira.page, "voice-phone");
  await mira.page.setViewportSize(DESKTOP);
  for (const u of [jonas, lena, mira]) await u.page.getByTestId("voice-leave").click().catch(() => undefined);

  // Roles editor.
  await mira.page.goto(`/rooms/${room.id}/settings/roles`);
  await mira.page.getByTestId("role-list").getByText("Moderator").click();
  await expect(mira.page.getByTestId("role-editor")).toBeVisible();
  await shot(mira.page, "roles-desktop");

  // Files channel with a few uploads.
  await mira.page.goto(`/rooms/${room.id}/channels/${files.id}`);
  await expect(mira.page.getByTestId("files-view")).toBeVisible();
  await mira.page.getByTestId("files-upload-input").setInputFiles([
    { name: "boss-arena.png", mimeType: "image/png", buffer: arenaMap() },
    { name: "raid-roster.csv", mimeType: "text/plain", buffer: Buffer.from("name,role\nMira,healer\nJonas,tank\nLena,dps\nTheo,dps\n") },
    { name: "loot-rules.txt", mimeType: "text/plain", buffer: Buffer.from("Need before greed. Mounts are rolled at the end.\n") },
    { name: "speedrun-route.txt", mimeType: "text/plain", buffer: Buffer.from("Skip the bridge, take the left tunnel.\n") },
  ]);
  await expect(mira.page.getByTestId("upload-item").and(mira.page.locator('[data-status="done"]'))).toHaveCount(4, { timeout: 30_000 });
  for (const folder of ["Maps", "Clips"]) {
    await mira.page.getByTestId("files-new-folder").click();
    await mira.page.getByTestId("files-name-input").fill(folder);
    await mira.page.getByTestId("files-name-submit").click();
    await expect(mira.page.getByText(folder, { exact: true }).first()).toBeVisible();
  }
  await mira.page.reload();
  await expect(mira.page.getByTestId("files-view")).toBeVisible();
  await shot(mira.page, "files-desktop");

  // Security settings.
  await mira.page.goto("/settings/security");
  const cdp = await mira.page.context().newCDPSession(mira.page);
  await cdp.send("WebAuthn.enable");
  await cdp.send("WebAuthn.addVirtualAuthenticator", { options: { protocol: "ctap2", ctap2Version: "ctap2_1", transport: "internal", hasResidentKey: true, hasUserVerification: true, isUserVerified: true, automaticPresenceSimulation: true, hasPrf: true } } as never);
  await mira.page.getByRole("button", { name: "Add passkey" }).click();
  await mira.page.getByLabel("Name of the passkey", { exact: true }).fill("Laptop fingerprint");
  await mira.page.getByRole("button", { name: "Add passkey" }).click();
  const reauth = mira.page.getByTestId("reauth-dialog");
  await reauth.getByTestId("reauth-password").fill(mira.password);
  await reauth.getByTestId("reauth-submit").click();
  await expect(mira.page.getByTestId("passkey-list")).toContainText("Laptop fingerprint", { timeout: 30_000 });
  const toast = mira.page.getByText("Passkey added", { exact: false });
  await toast.locator("xpath=..").getByRole("button").first().click({ timeout: 3_000 }).catch(() => undefined);
  await expect(toast).toHaveCount(0, { timeout: 15_000 }).catch(() => undefined);
  await mira.page.waitForLoadState("networkidle");
  await shot(mira.page, "security-desktop");

  // Add-application consent screen (Lena's bot, installed by Mira).
  const app = await api(lena.page, "POST", "/applications", lena.token, { name: "Raid Planner", description: "Schedules raids, tracks sign-ups and reminds everyone an hour before the pull.", public: true, requested_permissions: (bit(0) | bit(1) | bit(4) | bit(25)).toString() });
  await mira.page.goto(`/add/${app.id}`);
  await expect(mira.page.getByTestId("add-app-consent")).toBeVisible();
  await mira.page.locator(`[data-testid="add-app-room"][data-room="${room.id}"]`).click().catch(() => undefined);
  await shot(mira.page, "consent-desktop");

  // Node administration.
  await mira.page.goto("/admin");
  await mira.page.waitForLoadState("networkidle");
  await shot(mira.page, "admin-desktop");

});
