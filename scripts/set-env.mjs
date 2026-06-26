import { execSync } from "child_process";

const dbUrl = "postgresql://postgres:{KHaYesPi@14#}@db.goxbskpquiokxzklpkhr.supabase.co:5432/postgres";
const directUrl = "postgresql://postgres:{KHaYesPi@14#}@db.goxbskpquiokxzklpkhr.supabase.co:5432/postgres";

// Write to temp file, then pipe
import { writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const tmpFile = join(tmpdir(), "vercel_db_url.txt");
writeFileSync(tmpFile, dbUrl, "utf-8");

console.log("Setting DATABASE_URL...");
execSync(`Get-Content "${tmpFile}" | vercel env add DATABASE_URL production`, { stdio: "inherit" });

writeFileSync(tmpFile, directUrl, "utf-8");
console.log("Setting DIRECT_URL...");
execSync(`Get-Content "${tmpFile}" | vercel env add DIRECT_URL production`, { stdio: "inherit" });

console.log("Done!");
