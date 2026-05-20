import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadEnv } from "./load-env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

loadEnv();
console.log("Loaded .env configuration\n");

// Read configuration from environment variables
const ENABLE_CONTENT_SYNC = process.env.ENABLE_CONTENT_SYNC !== "false"; // enabled by default
const CONTENT_REPO_URL = process.env.CONTENT_REPO_URL || "";
const CONTENT_DIR = process.env.CONTENT_DIR || path.join(rootDir, "content");

console.log("Starting content sync...\n");

// Check whether content separation is enabled
if (!ENABLE_CONTENT_SYNC) {
	console.log("Content separation is disabled (ENABLE_CONTENT_SYNC=false)");
	console.log("Note: using local content; remote sync is skipped.");
	console.log("      To enable content separation, set in .env:");
	console.log("      ENABLE_CONTENT_SYNC=true");
	console.log("      CONTENT_REPO_URL=<your-repo-url>\n");
	process.exit(0);
}

// Check whether the content directory exists
if (!fs.existsSync(CONTENT_DIR)) {
	console.log(`Content directory does not exist: ${CONTENT_DIR}`);
	console.log("Using separate repository mode");

	if (!CONTENT_REPO_URL) {
		console.warn("Warning: CONTENT_REPO_URL is not set; using local content");
		console.log(
			"Hint: set CONTENT_REPO_URL or create the content directory manually",
		);
		process.exit(0);
	}

	try {
		console.log(`Cloning content repository: ${CONTENT_REPO_URL}`);
		execSync(`git clone --depth 1 ${CONTENT_REPO_URL} ${CONTENT_DIR}`, {
			stdio: "inherit",
			cwd: rootDir,
		});
		console.log("Content repository cloned successfully");
	} catch (error) {
		console.error("Clone failed:", error.message);
		process.exit(1);
	}
} else {
	console.log(`Content directory already exists: ${CONTENT_DIR}`);

	if (fs.existsSync(path.join(CONTENT_DIR, ".git"))) {
		try {
			console.log("Syncing remote content (force mode)...");

			// 1. Stash local changes to avoid losing them
			execSync("git stash push --include-untracked -m 'auto-sync'", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});

			// 2. Update remote references
			execSync("git fetch --all --prune", {
				stdio: "inherit",
				cwd: CONTENT_DIR,
			});

			// 3. Determine branch
			let branch = "main";
			try {
				execSync("git rev-parse --verify origin/main", { cwd: CONTENT_DIR });
			} catch {
				branch = "master";
			}

			// 4. Force sync to remote
		execSync(`git checkout ${branch}`, { cwd: CONTENT_DIR });
		execSync(`git reset --hard origin/${branch}`, { cwd: CONTENT_DIR });

		console.log(`Content sync succeeded (branch: ${branch})`);
		} catch (error) {
			console.warn("Content update failed:", error.message);
		}
	}
}

// Create symlinks or copy content
console.log("\nLinking content...");

const contentMappings = [
	{ src: "posts", dest: "src/content/posts" },
	{ src: "spec", dest: "src/content/spec" },
	{ src: "data", dest: "src/data" },
	{ src: "images", dest: "public/images" },
];

for (const mapping of contentMappings) {
	const srcPath = path.join(CONTENT_DIR, mapping.src);
	const destPath = path.join(rootDir, mapping.dest);

	if (!fs.existsSync(srcPath)) {
		console.log(`Skipping missing source directory: ${mapping.src}`);
		continue;
	}

	// If destination exists and is not a symlink, back it up
	if (fs.existsSync(destPath) && !fs.lstatSync(destPath).isSymbolicLink()) {
		const backupPath = `${destPath}.backup`;
		console.log(
			`Backing up existing content: ${mapping.dest} -> ${mapping.dest}.backup`,
		);
		if (fs.existsSync(backupPath)) {
			fs.rmSync(backupPath, { recursive: true, force: true });
		}
		fs.renameSync(destPath, backupPath);
	}

	// Remove existing symlink
	if (fs.existsSync(destPath)) {
		fs.unlinkSync(destPath);
	}

	// Create symlink (Windows may need admin rights; otherwise copy files)
	try {
		const relPath = path.relative(path.dirname(destPath), srcPath);
		fs.symlinkSync(relPath, destPath, "junction");
		console.log(`Created symlink: ${mapping.dest} -> ${mapping.src}`);
	} catch (error) {
		console.log(`Symlink failed; copying content: ${mapping.src} -> ${mapping.dest}`);
		copyRecursive(srcPath, destPath);
	}
}

console.log("\nContent sync complete\n");
try {
	// 1. Get content repo branch name
	const branch = execSync("git rev-parse --abbrev-ref HEAD", {
		cwd: CONTENT_DIR,
	})
		.toString()
		.trim();

	// 2. Get short content commit hash
	const hash = execSync("git rev-parse --short HEAD", {
		cwd: CONTENT_DIR,
	})
		.toString()
		.trim();

	// 3. Commit in main repository
	execSync("git add .", { cwd: rootDir });

	execSync(
		`git commit -m "chore(content): sync ${branch}@${hash}"`,
		{ cwd: rootDir },
	);

	console.log(`Committed content update (${branch}@${hash})`);
} catch {
	console.log("No changes to commit");
}

// Recursive copy helper
function copyRecursive(src, dest) {
	if (fs.statSync(src).isDirectory()) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest, { recursive: true });
		}
		const files = fs.readdirSync(src);
		for (const file of files) {
			copyRecursive(path.join(src, file), path.join(dest, file));
		}
	} else {
		fs.copyFileSync(src, dest);
	}
}
