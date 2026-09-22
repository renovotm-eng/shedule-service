import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(path.join(dist, "src"), { recursive: true });

await fs.copyFile(path.join(root, "index.html"), path.join(dist, "index.html"));

for (const file of ["config.js", "demoData.js", "main.js", "scheduleApi.js", "scheduleLogic.js", "styles.css"]) {
  if (file === "config.js") {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

    if (supabaseUrl && supabaseAnonKey) {
      await fs.writeFile(
        path.join(dist, "src", file),
        `export const SUPABASE_URL = ${JSON.stringify(supabaseUrl)};\nexport const SUPABASE_ANON_KEY = ${JSON.stringify(supabaseAnonKey)};\n`
      );
      continue;
    }
  }

  await fs.copyFile(path.join(root, "src", file), path.join(dist, "src", file));
}

console.log("Static site built into dist/");
