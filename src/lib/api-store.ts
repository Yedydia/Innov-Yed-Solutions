import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");

async function ensureDir() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch { /* exists */ }
}

export async function saveData<T>(collection: string, data: T): Promise<void> {
  await ensureDir();
  const filePath = path.join(DATA_DIR, `${collection}.json`);
  let records: T[] = [];
  try {
    const content = await fs.readFile(filePath, "utf-8");
    records = JSON.parse(content);
  } catch { /* new file */ }
  records.push(data);
  await fs.writeFile(filePath, JSON.stringify(records, null, 2), "utf-8");
}
