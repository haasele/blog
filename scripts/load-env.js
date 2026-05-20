import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// Load .env file
export function loadEnv() {
	const envPath = path.join(rootDir, ".env");
	if (fs.existsSync(envPath)) {
		const envContent = fs.readFileSync(envPath, "utf-8");
		envContent.split("\n").forEach((line) => {
			const line_ = line.trim();
			// Skip comments and blank lines
			if (!line_ || line_.startsWith("#")) return;

			const match = line_.match(/^([^=]+)=(.*)$/);
			if (match) {
				const key = match[1].trim();
				let value = match[2].trim();
				// Strip surrounding quotes
				value = value.replace(/^["']|["']$/g, "");
				process.env[key] = value;
			}
		});
	}
}
