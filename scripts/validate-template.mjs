import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const root = process.cwd();
const failures = [];
const textExtensions = new Set([".css", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8");
}

function requireMatch(relativePath, pattern, message) {
  if (!pattern.test(read(relativePath))) failures.push(message);
}

function walk(relativePath) {
  const absolutePath = resolve(root, relativePath);
  return readdirSync(absolutePath).flatMap((entry) => {
    const child = join(absolutePath, entry);
    if (statSync(child).isDirectory()) return walk(child.slice(root.length + 1));
    return textExtensions.has(extname(child)) ? [child] : [];
  });
}

const prospectModule = read("src/config/prospect.ts");
const activeClubMatch = prospectModule.match(/@\/config\/clubs\/([^";]+)/);
if (!activeClubMatch) {
  failures.push("src/config/prospect.ts must import exactly one active club module.");
} else {
  const activeConfigPath = `src/config/clubs/${activeClubMatch[1]}/index.ts`;
  if (!existsSync(resolve(root, activeConfigPath))) {
    failures.push(`Active club config is missing: ${activeConfigPath}`);
  } else {
    const activeConfig = read(activeConfigPath);
    const assetPaths = [...activeConfig.matchAll(/"(\/prospect\/[^"#?]+)"/g)].map((match) => match[1]);
    for (const assetPath of new Set(assetPaths)) {
      if (!existsSync(resolve(root, `public${assetPath}`))) {
        failures.push(`Referenced prospect asset is missing: public${assetPath}`);
      }
    }
  }
}

requireMatch("src/app/layout.tsx", /title:\s*prospect\.copy\.metadata\.title/, "Metadata title must come from prospect.copy.");
requireMatch("src/app/layout.tsx", /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/, "Preview metadata must remain noindex and nofollow.");
requireMatch("src/components/tier/TierProvider.tsx", /\(\): Tier => "pro"/, "The server tier snapshot must default to Pro.");
requireMatch("src/config/types.ts", /copy:\s*ProspectCopy/, "ProspectConfig must include the prospect copy contract.");

const { terms } = JSON.parse(read("template/brand-leak-terms.json"));
const sharedFiles = ["src/app", "src/components", "src/lib"].flatMap(walk);
for (const file of sharedFiles) {
  const contents = readFileSync(file, "utf8").toLowerCase();
  for (const term of terms) {
    if (contents.includes(term.toLowerCase())) {
      failures.push(`Brand-specific term \"${term}\" leaked into ${file.slice(root.length + 1)}.`);
    }
  }
}

if (failures.length) {
  console.error("Template validation failed:\n");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Template validation passed: active config, assets, Pro default, metadata, noindex, and shared-code brand isolation are intact.");
