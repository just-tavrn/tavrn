// SPDX-License-Identifier: Apache-2.0
//
// Playwright configuration of the screenshot script (make.ts). It expects a running development node and web
// client (assets/screenshots/README.md) and starts nothing itself.
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: /make\.ts$/,
  workers: 1,
  reporter: "list",
  expect: { timeout: 15_000 },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: `http://localhost:${process.env.SHOTS_WEB_PORT ?? "5700"}`,
    locale: "en-US",
    colorScheme: "dark",
    trace: "retain-on-failure",
  },
});
