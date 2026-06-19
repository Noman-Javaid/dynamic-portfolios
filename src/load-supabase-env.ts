import "server-only";
import { config } from "dotenv";
import { join } from "node:path";

config({ path: join(process.cwd(), "supabase", ".env") });
