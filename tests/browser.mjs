import { chromium, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";
const base = process.env.BIBLE_TEST_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
const external = [];
let checks = 0;
page.on("pageerror", (e) => errors.push(e.message));
page.on("request", (r) => {
  if (!r.url().startsWith(base) && !r.url().startsWith("data:"))
    external.push(r.url());
});
const pass = (s) => {
  checks++;
  console.log(`PASS ${s}`);
};
try {
  await page.goto(base);
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".atlas-node")).toHaveCount(67);
  const before = await page.locator(".atlas-controlbar output").innerText();
  await page.getByRole("button", { name: "Zoom in atlas" }).click();
  expect(await page.locator(".atlas-controlbar output").innerText()).not.toBe(
    before,
  );
  await page.getByRole("button", { name: "Reset atlas" }).click();
  await page
    .getByRole("button", { name: "Northern Israel", exact: true })
    .click();
  expect(await page.locator(".atlas-node").count()).toBeLessThan(67);
  await page
    .getByRole("button", { name: "Northern Israel", exact: true })
    .click();
  await page.getByRole("button", { name: "Event list", exact: true }).click();
  await expect(page.locator(".event-card")).toHaveCount(67);
  pass("atlas zoom, lane controls, and accessible event-list view");
  await page
    .getByRole("textbox", { name: "Filter timeline events" })
    .fill("Joseph");
  await expect(page.locator(".event-card")).toHaveCount(2);
  await page
    .getByRole("textbox", { name: "Filter timeline events" })
    .fill("unmatched-query-xyz");
  await expect(
    page.getByText("No events found", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page.getByRole("button", { name: "The life of Jesus 09" }).click();
  await expect(page.locator(".event-card")).toHaveCount(10);
  pass("timeline content, search, empty state, and era filtering");
  await page
    .getByRole("button", { name: "Save The birth of Jesus", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Saved events (1)" }).click();
  await expect(page.locator(".event-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "The birth of Jesus", exact: true }),
  ).toBeVisible();
  pass("bookmarks persist across reload");
  await page.locator(".event-open").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByText("Read the source passages")).toBeVisible();
  await expect(page.locator(".passage").first()).toContainText(
    "Now the birth of Jesus Christ",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  pass("event evidence loads and keyboard dismissal works");
  await page
    .getByRole("button", { name: "Parallel stories", exact: true })
    .click();
  await expect(page.locator(".connection-card")).toHaveCount(21);
  await expect(page.locator(".branch-step")).toHaveCount(8);
  await page
    .getByRole("button", { name: "Joseph & Judah", exact: true })
    .click();
  await expect(page.locator(".branch-step")).toHaveCount(2);
  await page.locator(".branch-step").last().getByRole("button").first().click();
  await expect(page.getByRole("dialog")).toContainText("Judah and Tamar");
  await page.keyboard.press("Escape");
  pass("interactive narrative branches open their source-backed events");

  await page
    .getByRole("button", { name: "Overlapping periods", exact: true })
    .click();
  await expect(page.locator(".connection-card")).toHaveCount(7);
  await page
    .getByRole("button", { name: "Parallel accounts", exact: true })
    .click();
  await page
    .getByRole("button", { name: /One feeding, four Gospel accounts/ })
    .click();
  await expect(page.locator("dialog .passage")).toHaveCount(4);
  await expect(page.locator("dialog .passage").last()).toContainText(
    "John 6:1–15",
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  pass("relationship types and four-way Gospel comparison");
  await page
    .getByRole("button", { name: "Search Scripture", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search words or Bible reference" })
    .fill("John 3:16");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("#verse-16")).toContainText(
    "For God so loved the world",
  );
  await expect(page.locator("#verse-16")).toContainText("దేవుడు");
  await expect(page.locator("#verse-16")).toHaveClass(/highlight/);
  expect(page.url()).toContain(
    "#reader?edition=kjv&book=43&chapter=3&verse=16",
  );
  await page.reload();
  await expect(page.locator("#verse-16")).toContainText(
    "For God so loved the world",
  );
  await expect(page.locator("#verse-16")).toHaveClass(/highlight/);
  pass("reader deep link retains the selected passage after reload");
  await page.getByRole("button", { name: "Next chapter", exact: true }).click();
  await expect(
    page.getByRole("combobox", { name: "Bible chapter" }),
  ).toHaveValue("4");
  await page.getByRole("combobox", { name: "Bible book" }).selectOption("66");
  await page
    .getByRole("combobox", { name: "Bible chapter" })
    .selectOption("22");
  await expect(page.locator("#verse-21")).toContainText(
    "The grace of our Lord Jesus Christ",
  );
  await expect(
    page.getByRole("button", { name: "Next chapter", exact: true }),
  ).toBeDisabled();
  pass(
    "direct reference lookup, bilingual reading, chapter navigation, and final chapter",
  );
  await page
    .getByRole("button", { name: "Search Scripture", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Search words or Bible reference" })
    .fill("love");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".search-results>button")).toHaveCount(100, {
    timeout: 20000,
  });
  await expect(page.locator(".search-status")).toContainText("matching verses");
  await page
    .getByRole("combobox", { name: "Search edition" })
    .selectOption("tel");
  await page
    .getByRole("textbox", { name: "Search words or Bible reference" })
    .fill("వెలుగు");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".search-results>button").first()).toBeVisible({
    timeout: 20000,
  });
  await expect(page.locator(".search-results>button").first()).toContainText(
    "వెలుగు",
  );
  await page
    .getByRole("textbox", { name: "Search words or Bible reference" })
    .fill("Revelation 99:1");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.locator(".search-status")).toContainText("not present");
  await page.getByRole("button", { name: "Close dialog" }).click();
  pass("whole-Bible English and Telugu searches and invalid references");
  await page
    .getByRole("button", { name: "Sources & approach", exact: true })
    .click();
  await expect(page.locator(".source-card")).toHaveCount(3);
  await page.locator(".issue-list button").first().click();
  await expect(
    page.getByRole("combobox", { name: "Bible edition" }),
  ).toHaveValue("tel");
  await expect(page.locator("#verse-27")).toContainText("Text missing");
  await page
    .getByRole("combobox", { name: "Bible edition" })
    .selectOption("drc");
  await page.getByRole("combobox", { name: "Bible book" }).selectOption("42");
  await expect(page.locator(".source-warning").first()).toContainText(
    "Duplicate verse number",
  );
  await expect(
    page.getByRole("button", { name: "Single edition", exact: true }),
  ).toBeDisabled();
  pass("source issues open correct editions and DRC limitations are visible");
  const pdf = await page.request.get(`${base}/pdf/1.pdf`);
  expect(pdf.ok()).toBeTruthy();
  expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
  pass("supplied PDF is served as a real document");
  await page.getByRole("button", { name: "The timeline", exact: true }).click();
  await page.getByRole("button", { name: "The whole story 67" }).click();
  mkdirSync("test-results", { recursive: true });
  await page.screenshot({ path: "test-results/desktop.png", fullPage: false });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(
    page.getByRole("button", { name: "Toggle navigation" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await page.screenshot({ path: "test-results/mobile.png", fullPage: false });
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await page
    .getByRole("button", { name: "Bible library", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Bible edition" })
    .selectOption("kjv");
  await page.getByRole("combobox", { name: "Bible book" }).selectOption("1");
  await expect(page.locator("#verse-1")).toContainText("In the beginning");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  pass("mobile navigation and reader fit without horizontal overflow");
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
  pass("no browser exceptions or third-party runtime requests");
  const isolated = await browser.newPage();
  await isolated.route("**/data/kjv/1.json", (r) =>
    r.fulfill({ status: 503, body: "Unavailable" }),
  );
  await isolated.goto(`${base}/#reader`);
  await expect(isolated.getByRole("alert")).toContainText(
    "could not be loaded",
  );
  await isolated.unroute("**/data/kjv/1.json");
  await isolated.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(isolated.locator("#verse-1")).toContainText("In the beginning");
  await isolated.close();
  pass("failed text fetch has a working retry path");
  console.log(`${checks} browser scenarios passed.`);
} finally {
  await browser.close();
}
