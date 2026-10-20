import { readFile, mkdir, rm, cp } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = fileURLToPath(new URL("../", import.meta.url));
const policy = JSON.parse(
  await readFile(path.join(root, "src/data/publication.json"), "utf8"),
);
const stage = path.join(root, ".public-release");
await rm(stage, { recursive: true, force: true });
await mkdir(path.join(stage, "data"), { recursive: true });
const approved = [];
for (const edition of policy.editions) {
  if (!["kjv", "tel", "drc"].includes(edition.id))
    throw new Error("Unknown edition ID");
  if (!edition.approved) continue;
  if (
    !edition.licenseUrl?.startsWith("https://") ||
    !edition.verifiedBy?.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(edition.verifiedOn ?? "")
  )
    throw new Error(`Missing permission evidence: ${edition.id}`);
  await cp(
    path.join(root, "public/data", edition.id),
    path.join(stage, "data", edition.id),
    { recursive: true },
  );
  approved.push(edition.id);
}
if (policy.pdfsApproved)
  throw new Error(
    "PDF publication needs a documented per-edition permission policy before it can be enabled.",
  );
await cp(
  path.join(root, "public/data/manifest.json"),
  path.join(stage, "data/manifest.json"),
);
console.log(
  `Public release: ${approved.length ? approved.join(", ") : "source links only; full text pending permission verification"}. No PDFs included.`,
);
