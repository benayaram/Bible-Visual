import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.BIBLE_TEST_URL || "http://127.0.0.1:4176";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const localFiles = [];
  const errors = [];
  page.on("request", (r) => {
    if (/\/data\/(kjv|tel|drc)\/\d+\.json|\/pdf\/\d+\.pdf/.test(r.url()))
      localFiles.push(r.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await expect(page.locator(".atlas-node")).toHaveCount(67);
  await page
    .getByRole("button", { name: "Explore Creation of heaven and earth" })
    .click();
  await expect(page.getByRole("dialog")).toContainText(
    "Read this passage at WordProject",
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page.getByRole("button", { name: "Bible library" }).click();
  await expect(
    page.getByText("This edition opens at its source"),
  ).toBeVisible();
  await page
    .getByRole("combobox", { name: "Bible edition" })
    .selectOption("tel");
  await expect(
    page.locator('.reader-wrap a[href*="wordproject.org"]'),
  ).toHaveCount(2);
  await expect(page.locator(".scripture .verse-row")).toHaveCount(0);
  await page.getByRole("button", { name: "Search Scripture" }).click();
  await expect(
    page.getByText("Full-text search is awaiting edition permission."),
  ).toBeVisible();
  assert.deepEqual(localFiles, []);
  assert.deepEqual(errors, []);
  console.log(
    "Public release smoke passed: atlas, source links, edition switch, permission notice, and no uploaded text requests.",
  );
} finally {
  await browser.close();
}
