import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { getDb } from "@/db/client";
import { commitImport } from "@/domain/imports/service";

const supported = new Set([".json", ".jsonl", ".ndjson", ".csv", ".xlsx"]);

async function main() {
  const inbox = path.join(process.cwd(), "data/imports/inbox");
  const { client, db } = await getDb();
  const files = (await readdir(inbox)).filter((name) => supported.has(path.extname(name).toLowerCase())).sort();
  const results = [];
  for (const filename of files) {
    try {
      results.push({ filename, ...(await commitImport(db, {
        filename,
        content: new Uint8Array(await readFile(path.join(inbox, filename))),
      })) });
    } catch (error) {
      results.push({ filename, error: error instanceof Error ? error.message : String(error) });
    }
  }
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
  await client.close();
  if (results.some((result) => "error" in result)) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
  process.exitCode = 1;
});
