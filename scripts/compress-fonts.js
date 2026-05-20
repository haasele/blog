import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Fontmin from "fontmin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read config file for language settings and font configuration
async function getConfig() {
	const configPath = path.join(__dirname, "../src/config.ts");
	const configContent = fs.readFileSync(configPath, "utf-8");

	// Extract language setting
	const langMatch = configContent.match(/const SITE_LANG = ["'](.+?)["']/);
	const lang = langMatch ? langMatch[1] : "zh_CN";

	// Extract font configuration
	const fontConfigMatch = configContent.match(/font:\s*\{([\s\S]*?)\n\t\},/);
	if (!fontConfigMatch) {
		console.log("⚠ Font config not found, using default settings");
		return { lang, fonts: [] };
	}

	const fontConfigStr = fontConfigMatch[1];
	const fonts = [];

	// Parse each font category (asciiFont, cjkFont)
	const fontTypes = ["asciiFont", "cjkFont"];

	for (const fontType of fontTypes) {
		const regex = new RegExp(`${fontType}:\\s*\\{([\\s\\S]*?)\\}`, "m");
		const match = fontConfigStr.match(regex);

		if (match) {
			const fontConfig = match[1];

			// Extract enableCompress
			const compressMatch = fontConfig.match(
				/enableCompress:\s*(true|false)/,
			);
			const enableCompress = compressMatch
				? compressMatch[1] === "true"
				: false;

			// Extract localFonts array
			const localFontsMatch = fontConfig.match(
				/localFonts:\s*\[(.*?)\]/s,
			);
			let localFonts = [];

			if (localFontsMatch?.[1].trim()) {
				// Extract strings from the array
				const fontsStr = localFontsMatch[1];
				localFonts =
					fontsStr
						.match(/["']([^"']+)["']/g)
						?.map((s) => s.replace(/["']/g, "")) || [];
			}

			if (enableCompress && localFonts.length > 0) {
				fonts.push({
					type: fontType,
					files: localFonts,
					enableCompress,
				});
			}
		}
	}

	return { lang, fonts };
}

// Recursively read all files under a directory
function readFilesRecursively(dir, fileList = []) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			readFilesRecursively(filePath, fileList);
		} else {
			fileList.push(filePath);
		}
	});

	return fileList;
}

// Extract text content
function extractText(content, ext) {
	let text = content;
	let frontmatterText = "";

	// Extract and process text in frontmatter
	if (ext === ".md" || ext === ".mdx") {
		const frontmatterMatch = content.match(/^---[\s\S]*?---/m);
		if (frontmatterMatch) {
			const frontmatter = frontmatterMatch[0];

			// Extract string values from frontmatter (quoted and unquoted)
			// Match key: value format (unquoted)
			const unquotedMatches = frontmatter.match(
				/^\s*\w+:\s*([^'"\n]+)$/gm,
			);
			if (unquotedMatches) {
				unquotedMatches.forEach((match) => {
					const value = match.replace(/^\s*\w+:\s*/, "").trim();
					// Skip booleans, dates, numbers, and other non-text values
					if (!value.match(/^(true|false|\d{4}-\d{2}-\d{2}|\d+)$/)) {
						frontmatterText += `${value} `;
					}
				});
			}

			// Extract quoted string values
			const quotedMatches = frontmatter.match(/:\s*['"]([^'"]+)['"]/g);
			if (quotedMatches) {
				quotedMatches.forEach((match) => {
					const value = match.replace(/:\s*['"]([^'"]+)['"]/, "$1");
					frontmatterText += `${value} `;
				});
			}

			// Extract list item text (e.g. tags list)
			const listMatches = frontmatter.match(/^\s*-\s*([^\n]+)$/gm);
			if (listMatches) {
				listMatches.forEach((match) => {
					const value = match.replace(/^\s*-\s*/, "").trim();
					frontmatterText += `${value} `;
				});
			}
		}

		// Remove frontmatter, then process body
		text = text.replace(/^---[\s\S]*?---\s*/m, "");

		// Strip code blocks (usually no special font needed)
		text = text.replace(/```[\s\S]*?```/g, "");
		text = text.replace(/`[^`]+`/g, "");
	}

	// Remove HTML tags
	text = text.replace(/<[^>]*>/g, " ");

	// Remove Markdown syntax
	text = text.replace(/[#*_~`[\]()]/g, " ");

	// Remove URLs
	text = text.replace(/https?:\/\/[^\s]+/g, "");

	// Collapse extra whitespace
	text = text.replace(/\s+/g, " ").trim();

	// Merge frontmatter text and body
	const finalText = `${frontmatterText} ${text}`.trim();

	return finalText;
}

// Build ASCII charset (for asciiFont)
function getAsciiCharset() {
	const chars = new Set();

	// Basic ASCII: space through tilde (32-126)
	for (let i = 32; i <= 126; i++) {
		chars.add(String.fromCharCode(i));
	}

	// Common symbols and punctuation
	const common = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
	for (const char of common) {
		chars.add(char);
	}

	// Digits
	for (let i = 0; i <= 9; i++) {
		chars.add(String(i));
	}

	// Latin letters
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (const char of alphabet) {
		chars.add(char);
	}

	const text = Array.from(chars).sort().join("");

	return text;
}

// Collect text from Meting API playlist data
async function fetchMetingPlaylistText() {
	try {
		// Read config for music player settings
		const configPath = path.join(__dirname, "../src/config.ts");
		const configContent = fs.readFileSync(configPath, "utf-8");

		// Check whether music player is enabled
		const enableMatch = configContent.match(
			/musicPlayerConfig:\s*MusicPlayerConfig\s*=\s*\{[\s\S]*?enable:\s*(true|false)/,
		);
		if (!enableMatch || enableMatch[1] === "false") {
			console.log(
				"ℹ Music player disabled, skipping Meting API text collection",
			);
			return new Set();
		}

		// Extract music player config (defaults when config is incomplete)
		// In the music player component, mode defaults to "meting" when omitted
		const musicConfigMatch = configContent.match(
			/musicPlayerConfig:\s*MusicPlayerConfig\s*=\s*\{([\s\S]*?)\}/,
		);
		let mode = "meting"; // default mode
		let meting_api =
			"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
		let meting_id = "14164869977";
		let meting_server = "netease";
		let meting_type = "playlist";

		if (musicConfigMatch) {
			const configStr = musicConfigMatch[1];

			const modeMatch = configStr.match(/mode:\s*["']([^"']+)["']/);
			if (modeMatch) {
				mode = modeMatch[1];
			}

			const apiMatch = configStr.match(/meting_api:\s*["']([^"']+)["']/);
			if (apiMatch) {
				meting_api = apiMatch[1];
			}

			const idMatch = configStr.match(/id:\s*["']([^"']+)["']/);
			if (idMatch) {
				meting_id = idMatch[1];
			}

			const serverMatch = configStr.match(/server:\s*["']([^"']+)["']/);
			if (serverMatch) {
				meting_server = serverMatch[1];
			}

			const typeMatch = configStr.match(/type:\s*["']([^"']+)["']/);
			if (typeMatch) {
				meting_type = typeMatch[1];
			}
		}

		if (mode !== "meting") {
			console.log(
				'ℹ Music player mode is not "meting", skipping API text collection',
			);
			return new Set();
		}

		// Build API URL
		const apiUrl = meting_api
			.replace(":server", meting_server)
			.replace(":type", meting_type)
			.replace(":id", meting_id)
			.replace(":auth", "")
			.replace(":r", Date.now().toString());

		console.log("ℹ Fetching music playlist from Meting API...");
		console.log(`  URL: ${apiUrl}`);

		// Set request timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

		const textSet = new Set();

		try {
			const response = await fetch(apiUrl, {
				signal: controller.signal,
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
				},
			});
			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(
					`HTTP ${response.status}: ${response.statusText}`,
				);
			}

			const playlist = await response.json();

			if (!Array.isArray(playlist)) {
				throw new Error("API response is not an array");
			}

			console.log(
				`✓ Successfully fetched ${playlist.length} songs from Meting API`,
			);

			// Extract characters from song metadata
			let songCount = 0;
			playlist.forEach((song) => {
				const title = song.name ?? song.title ?? "";
				const artist = song.artist ?? song.author ?? "";

				// Only process valid song entries
				if (title.trim() || artist.trim()) {
					songCount++;

					// Add characters from song title
					for (const char of title) {
						textSet.add(char);
					}

					// Add characters from artist name
					for (const char of artist) {
						textSet.add(char);
					}
				}
			});
			if (songCount === 0) {
				console.log("⚠ No valid song data found in API response");
			}
		} catch (fetchError) {
			clearTimeout(timeoutId);

			if (fetchError.name === "AbortError") {
				console.log(
					"⚠ Meting API request timeout (10s), skipping music text collection",
				);
			} else {
				console.log(
					`⚠ Failed to fetch Meting API data: ${fetchError.message}, skipping music text collection`,
				);
			}
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Meting API config: ${error.message}, skipping music text collection`,
		);
		return new Set();
	}
}

// Collect text from Bilibili movie data
async function fetchBilibiliMovieText() {
	try {
		// Read config for movie page settings
		const configPath = path.join(__dirname, "../src/config.ts");
		const configContent = fs.readFileSync(configPath, "utf-8");

		// Check whether movie page is enabled
		const featurePagesMatch = configContent.match(
			/featurePages:\s*\{([\s\S]*?)\}/,
		);
		if (featurePagesMatch) {
			const featureConfig = featurePagesMatch[1];
			const movieMatch = featureConfig.match(/movie:\s*(true|false)/);
			if (!movieMatch || movieMatch[1] === "false") {
				console.log(
					"ℹ Movie page disabled, skipping Bilibili text collection",
				);
				return new Set();
			}
		}

		// Extract movie configuration
		const movieModeMatch = configContent.match(
			/movie:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/,
		);
		const mode = movieModeMatch ? movieModeMatch[1] : "bangumi";

		if (mode !== "bilibili") {
			console.log(
				`ℹ Movie mode is not "bilibili", skipping Bilibili text collection`,
			);
			return new Set();
		}

		// Read bilibili-data.json
		const dataFilePath = path.join(
			__dirname,
			"../src/data/bilibili-data.json",
		);
		if (!fs.existsSync(dataFilePath)) {
			console.log(
				"ℹ Bilibili data file not found, skipping Bilibili text collection",
			);
			return new Set();
		}

		console.log("ℹ Reading movie data from Bilibili data file...");

		const textSet = new Set();
		const fileContent = fs.readFileSync(dataFilePath, "utf-8");
		const movieList = JSON.parse(fileContent);

		if (!Array.isArray(movieList)) {
			console.log(
				"⚠ Bilibili data is not an array, skipping text collection",
			);
			return new Set();
		}

		let processedCount = 0;

		// Process each movie entry
		for (const item of movieList) {
			// Extract title
			const title = item.title || "";
			for (const char of title) {
				textSet.add(char);
			}

			// Extract description/review
			const description = item.description || item.evaluate || "";
			for (const char of description) {
				textSet.add(char);
			}

			// Extract studio/region
			const studio = item.studio || "";
			for (const char of studio) {
				textSet.add(char);
			}

			// Extract year
			const year = item.year || "";
			for (const char of year) {
				textSet.add(char);
			}

			// Extract genre/tags/style
			if (item.genre && Array.isArray(item.genre)) {
				item.genre.forEach((genre) => {
					if (typeof genre === "string") {
						for (const char of genre) {
							textSet.add(char);
						}
					}
				});
			}

			// Extract subtitle (if present)
			const subtitle = item.subtitle || "";
			if (subtitle) {
				for (const char of subtitle) {
					textSet.add(char);
				}
			}

			processedCount++;
		}

		if (processedCount > 0) {
			console.log(
				`✓ Successfully processed ${processedCount} movie items from Bilibili data`,
			);
		} else {
			console.log("⚠ No movie data found in Bilibili data file");
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Bilibili data: ${error.message}, skipping Bilibili text collection`,
		);
		return new Set();
	}
}

// Collect text from Bangumi API movie data
async function fetchBangumiMovieText() {
	try {
		// Read config for movie page settings
		const configPath = path.join(__dirname, "../src/config.ts");
		const configContent = fs.readFileSync(configPath, "utf-8");

		// Check whether movie page is enabled
		const featurePagesMatch = configContent.match(
			/featurePages:\s*\{([\s\S]*?)\}/,
		);
		if (featurePagesMatch) {
			const featureConfig = featurePagesMatch[1];
			const movieMatch = featureConfig.match(/movie:\s*(true|false)/);
			if (!movieMatch || movieMatch[1] === "false") {
				console.log(
					"ℹ Movie page disabled, skipping Bangumi API text collection",
				);
				return new Set();
			}
		}

		// Extract movie configuration
		const bangumiUserIdMatch = configContent.match(
			/bangumi:\s*\{[\s\S]*?userId:\s*["']([^"']+)["']/,
		);
		const movieModeMatch = configContent.match(
			/movie:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/,
		);

		const userId = bangumiUserIdMatch ? bangumiUserIdMatch[1] : null;
		const mode = movieModeMatch ? movieModeMatch[1] : "bangumi";

		if (mode !== "bangumi" || !userId) {
			console.log(
				`ℹ Movie mode is not "bangumi" or no userId configured, skipping Bangumi API text collection`,
			);
			return new Set();
		}

		console.log("ℹ Fetching movie data from Bangumi API...");
		console.log(`  User ID: ${userId}`);

		const textSet = new Set();
		const BANGUMI_API_BASE = "https://api.bgm.tv";

		// Bangumi collection types: 1=wish, 2=completed, 3=watching, 4=on hold, 5=dropped
		const collectionTypes = [1, 2, 3, 4, 5];

		// Fetch a single collection list
		async function fetchCollection(userId, subjectType, type) {
			try {
				let allData = [];
				let offset = 0;
				const limit = 50;
				let hasMore = true;

				while (hasMore) {
					const controller = new AbortController();
					const timeoutId = setTimeout(
						() => controller.abort(),
						10000,
					);

					const response = await fetch(
						`${BANGUMI_API_BASE}/v0/users/${userId}/collections?subject_type=${subjectType}&type=${type}&limit=${limit}&offset=${offset}`,
						{
							signal: controller.signal,
							headers: {
								"User-Agent":
									"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
							},
						},
					);
					clearTimeout(timeoutId);

					if (!response.ok) {
						throw new Error(
							`HTTP ${response.status}: ${response.statusText}`,
						);
					}

					const data = await response.json();

					if (data.data && data.data.length > 0) {
						allData = [...allData, ...data.data];
					}

					if (!data.data || data.data.length < limit) {
						hasMore = false;
					} else {
						offset += limit;
					}

					// Throttle requests to avoid rate limits
					await new Promise((resolve) => setTimeout(resolve, 200));
				}

				return allData;
			} catch (error) {
				console.log(
					`⚠ Failed to fetch collection type ${type}: ${error.message}`,
				);
				return [];
			}
		}

		// Fetch related persons (studios, etc.)
		async function fetchSubjectPersons(subjectId) {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				const response = await fetch(
					`${BANGUMI_API_BASE}/v0/subjects/${subjectId}/persons`,
					{
						signal: controller.signal,
						headers: {
							"User-Agent":
								"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
						},
					},
				);
				clearTimeout(timeoutId);

				if (!response.ok) {
					return [];
				}

				const data = await response.json();
				return Array.isArray(data) ? data : [];
			} catch (_error) {
				return [];
			}
		}

		let totalItems = 0;

		// Iterate all collection types
		for (const type of collectionTypes) {
			const collections = await fetchCollection(userId, 2, type); // 2=movie

			if (collections.length === 0) {
				continue;
			}

			console.log(
				`✓ Fetched ${collections.length} items from collection type ${type}`,
			);
			totalItems += collections.length;

			// Process each movie entry
			for (const item of collections) {
				const subject = item.subject || {};

				// Extract title
				const titleCn = subject.name_cn || "";
				const title = subject.name || "";

				for (const char of titleCn) {
					textSet.add(char);
				}
				for (const char of title) {
					textSet.add(char);
				}

				// Extract summary
				const summary = subject.short_summary || "";
				for (const char of summary) {
					textSet.add(char);
				}

				// Extract tags
				if (subject.tags && Array.isArray(subject.tags)) {
					subject.tags.forEach((tag) => {
						if (tag.name) {
							for (const char of tag.name) {
								textSet.add(char);
							}
						}
					});
				}

				// Fetch studio info (limit concurrent requests)
				if (item.subject_id && Math.random() < 0.3) {
					// Fetch details for only 30% to limit API calls
					const persons = await fetchSubjectPersons(item.subject_id);

					persons.forEach((person) => {
						if (person.name) {
							for (const char of person.name) {
								textSet.add(char);
							}
						}
						if (person.relation) {
							for (const char of person.relation) {
								textSet.add(char);
							}
						}
					});

					// Delay between requests
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			}
		}

		if (totalItems > 0) {
			console.log(
				`✓ Successfully processed ${totalItems} movie items from Bangumi API`,
			);
		} else {
			console.log("⚠ No movie data found from Bangumi API");
		}

		return textSet;
	} catch (error) {
		console.log(
			`⚠ Error processing Bangumi API config: ${error.message}, skipping movie text collection`,
		);
		return new Set();
	}
}

// Collect all characters in use (for CJK fonts)
async function collectText() {
	const { lang } = await getConfig();

	const textSet = new Set();

	// 1. Read src/data directory
	const dataDir = path.join(__dirname, "../src/data");
	const dataFiles = readFilesRecursively(dataDir);

	dataFiles.forEach((file) => {
		if (file.endsWith(".ts") || file.endsWith(".js")) {
			const content = fs.readFileSync(file, "utf-8");

			// Improved string matching
			const patterns = [
				// Double-quoted strings
				/"([^"\\]|\\.|\\n|\\t)*"/g,
				// Single-quoted strings
				/'([^'\\]|\\.|\\n|\\t)*'/g,
				// Template strings
				/`([^`\\]|\\.|\\n|\\t)*`/g,
			];

			patterns.forEach((pattern) => {
				const matches = content.match(pattern);
				if (matches) {
					matches.forEach((match) => {
						let text = match;

						// Strip quotes
						if (
							(text.startsWith('"') && text.endsWith('"')) ||
							(text.startsWith("'") && text.endsWith("'")) ||
							(text.startsWith("`") && text.endsWith("`"))
						) {
							text = text.slice(1, -1);
						}

						// Unescape characters
						text = text
							.replace(/\\n/g, "\n")
							.replace(/\\t/g, "\t")
							.replace(/\\"/g, '"')
							.replace(/\\'/g, "'");

						for (const char of text) {
							textSet.add(char);
						}
					});
				}
			});

			// Simple regex as fallback
			const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
			if (stringMatches) {
				stringMatches.forEach((match) => {
					const text = match.slice(1, -1);
					for (const char of text) {
						textSet.add(char);
					}
				});
			}
		}
	});

	// 2. Read music player local playlist constants file
	const musicConstantsFile = path.join(
		__dirname,
		"../src/components/widgets/music-player/constants.ts",
	);
	if (fs.existsSync(musicConstantsFile)) {
		const content = fs.readFileSync(musicConstantsFile, "utf-8");

		const patterns = [
			/"([^"\\]|\\.|\\n|\\t)*"/g,
			/'([^'\\]|\\.|\\n|\\t)*'/g,
			/`([^`\\]|\\.|\\n|\\t)*`/g,
		];

		patterns.forEach((pattern) => {
			const matches = content.match(pattern);
			if (matches) {
				matches.forEach((match) => {
					let text = match;

					if (
						(text.startsWith('"') && text.endsWith('"')) ||
						(text.startsWith("'") && text.endsWith("'")) ||
						(text.startsWith("`") && text.endsWith("`"))
					) {
						text = text.slice(1, -1);
					}

					text = text
						.replace(/\\n/g, "\n")
						.replace(/\\t/g, "\t")
						.replace(/\\"/g, '"')
						.replace(/\\'/g, "'");

					for (const char of text) {
						textSet.add(char);
					}
				});
			}
		});

		const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
		if (stringMatches) {
			stringMatches.forEach((match) => {
				const text = match.slice(1, -1);
				for (const char of text) {
					textSet.add(char);
				}
			});
		}
	}

	// 3. Read src/config.ts
	const configFile = path.join(__dirname, "../src/config.ts");
	if (fs.existsSync(configFile)) {
		const content = fs.readFileSync(configFile, "utf-8");

		// Improved string matching
		const patterns = [
			// Double-quoted strings
			/"([^"\\]|\\.|\\n|\\t)*"/g,
			// Single-quoted strings
			/'([^'\\]|\\.|\\n|\\t)*'/g,
			// Template strings
			/`([^`\\]|\\.|\\n|\\t)*`/g,
		];

		patterns.forEach((pattern) => {
			const matches = content.match(pattern);
			if (matches) {
				matches.forEach((match) => {
					// Strip quotes and comment markers
					let text = match;

					// Remove string delimiters
					if (
						(text.startsWith('"') && text.endsWith('"')) ||
						(text.startsWith("'") && text.endsWith("'")) ||
						(text.startsWith("`") && text.endsWith("`"))
					) {
						text = text.slice(1, -1);
					}

					// Unescape characters
					text = text
						.replace(/\\n/g, "\n")
						.replace(/\\t/g, "\t")
						.replace(/\\"/g, '"')
						.replace(/\\'/g, "'");

					// Collect all characters (including CJK)
					for (const char of text) {
						textSet.add(char);
					}
				});
			}
		});

		// Also run simple regex pass to avoid missing strings
		const simpleMatches = content.match(/["'`]([^"'`]+)["'`]/g);
		if (simpleMatches) {
			simpleMatches.forEach((match) => {
				const text = match.slice(1, -1);
				for (const char of text) {
					textSet.add(char);
				}
			});
		}
	}

	// 4. Read i18n file for current language
	const i18nFile = path.join(__dirname, `../src/i18n/languages/${lang}.ts`);
	if (fs.existsSync(i18nFile)) {
		const content = fs.readFileSync(i18nFile, "utf-8");

		// Improved string matching
		const patterns = [
			/"([^"\\]|\\.|\\n|\\t)*"/g,
			/'([^'\\]|\\.|\\n|\\t)*'/g,
			/`([^`\\]|\\.|\\n|\\t)*`/g,
		];

		patterns.forEach((pattern) => {
			const matches = content.match(pattern);
			if (matches) {
				matches.forEach((match) => {
					let text = match;

					if (
						(text.startsWith('"') && text.endsWith('"')) ||
						(text.startsWith("'") && text.endsWith("'")) ||
						(text.startsWith("`") && text.endsWith("`"))
					) {
						text = text.slice(1, -1);
					}

					// Unescape characters
					text = text
						.replace(/\\n/g, "\n")
						.replace(/\\t/g, "\t")
						.replace(/\\"/g, '"')
						.replace(/\\'/g, "'");

					for (const char of text) {
						textSet.add(char);
					}
				});
			}
		});

		// Simple regex as fallback
		const stringMatches = content.match(/["'`]([^"'`]+)["'`]/g);
		if (stringMatches) {
			stringMatches.forEach((match) => {
				const text = match.slice(1, -1);
				for (const char of text) {
					textSet.add(char);
				}
			});
		}
	}

	// 5. Read content directory (path from env when set)
	let contentDir;
	if (process.env.ENABLE_CONTENT_SYNC === "true" && process.env.CONTENT_DIR) {
		// Use CONTENT_DIR from env (relative to project root)
		contentDir = path.join(__dirname, "..", process.env.CONTENT_DIR);
		console.log(
			`ℹ Using external content directory: ${process.env.CONTENT_DIR}`,
		);
	} else {
		// Use default src/content directory
		contentDir = path.join(__dirname, "../src/content");
	}

	// Check directory exists
	if (!fs.existsSync(contentDir)) {
		console.log(`⚠ Content directory does not exist: ${contentDir}`);
		console.log("  Skipping content text collection");
	} else {
		const contentFiles = readFilesRecursively(contentDir);

		contentFiles.forEach((file) => {
			const ext = path.extname(file);
			if ([".md", ".mdx", ".ts", ".js"].includes(ext)) {
				const content = fs.readFileSync(file, "utf-8");
				const text = extractText(content, ext);
				for (const char of text) {
					// Keep CJK characters and common punctuation only
					if (
						char.match(
							/[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u3000-\u303f\uff00-\uffef]/,
						)
					) {
						textSet.add(char);
					}
				}
			}
		});
	}

	// Add common punctuation and digits
	const commonChars = "0123456789，。！？；：\"\"''（）【】《》、·—…「」『』";
	for (const char of commonChars) {
		textSet.add(char);
	}

	// Add Latin letters (if font supports them)
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (const char of alphabet) {
		textSet.add(char);
	}

	// 6. Collect text from Meting API playlist
	const metingTextSet = await fetchMetingPlaylistText();

	// Merge Meting API characters into main set
	for (const char of metingTextSet) {
		textSet.add(char);
	}

	if (metingTextSet.size > 0) {
		console.log(
			`✓ Added ${metingTextSet.size} unique characters from music playlist`,
		);
	}

	// 7. Collect text from Bangumi API movie data
	const bangumiTextSet = await fetchBangumiMovieText();

	// Merge Bangumi API characters into main set
	for (const char of bangumiTextSet) {
		textSet.add(char);
	}

	if (bangumiTextSet.size > 0) {
		console.log(
			`✓ Added ${bangumiTextSet.size} unique characters from Bangumi movie data`,
		);
	}

	// 8. Collect text from Bilibili data file
	const bilibiliTextSet = await fetchBilibiliMovieText();

	// Merge Bilibili data characters into main set
	for (const char of bilibiliTextSet) {
		textSet.add(char);
	}

	if (bilibiliTextSet.size > 0) {
		console.log(
			`✓ Added ${bilibiliTextSet.size} unique characters from Bilibili movie data`,
		);
	}

	// Extra fallback terms (UI strings not captured elsewhere)
	const otherWords = ["Example", "Song", "Artist"];

	for (const term of otherWords) {
		for (const char of term) {
			textSet.add(char);
		}
	}

	const allText = Array.from(textSet).sort().join("");

	return allText;
}

// Compress fonts and write to dist
async function compressFonts() {
	try {
		// Read configuration
		const { fonts } = await getConfig();

		if (fonts.length === 0) {
			console.log(
				"⚠ No fonts to compress (enableCompress=false or localFonts is empty)",
			);
			return;
		}

		console.log(`Found ${fonts.length} font configs to compress`);

		// Check dist directory exists
		const distDir = path.join(__dirname, "../dist");
		if (!fs.existsSync(distDir)) {
			console.log(
				"⚠ dist directory does not exist, please run astro build first",
			);
			return;
		}

		// Create dist/assets/font directory
		const distFontDir = path.join(distDir, "assets/font");
		if (!fs.existsSync(distFontDir)) {
			fs.mkdirSync(distFontDir, { recursive: true });
		}

		// Collect charset per font type
		const cjkText = await collectText(); // CJK fonts use full charset
		const asciiText = getAsciiCharset(); // ASCII fonts use ASCII charset only

		console.log("Starting font compression...");

		let totalOriginalSize = 0;
		let totalCompressedSize = 0;
		let processedCount = 0;

		// Collect all errors
		const errors = [];

		// Iterate fonts to compress
		for (const fontConfig of fonts) {
			// Pick charset by font type
			const text = fontConfig.type === "asciiFont" ? asciiText : cjkText;

			for (const fontFile of fontConfig.files) {
				const fontSrc = path.join(
					__dirname,
					"../public/assets/font",
					fontFile,
				);
				const ext = path.extname(fontFile).toLowerCase();
				const baseName = path.basename(fontFile, ext);

				if (!fs.existsSync(fontSrc)) {
					const errorMsg = `❌ Config error [${fontConfig.type}]: Font file does not exist   In config: "${fontFile}"\n   Expected path: public/assets/font/${fontFile}\n   \n   Please check:\n   1. Is the filename correct (case sensitive)?\n   2. Is the file in public/assets/font/?\n   3. Is ${fontConfig.type}.localFonts in src/config.ts correct?`;

					errors.push(errorMsg);
					console.log(`\n${errorMsg}\n`);
					continue;
				}

				const originalSize = fs.statSync(fontSrc).size;
				totalOriginalSize += originalSize;

				// Choose handling by file type
				if (ext === ".woff2" || ext === ".woff") {
					// woff/woff2 are already web-optimized; no further subsetting
					console.log(
						`⚠ Skipping ${fontFile} (already web-optimized format)`,
					);

					// Copy directly to dist
					const destFile = path.join(distFontDir, fontFile);
					fs.copyFileSync(fontSrc, destFile);
					totalCompressedSize += originalSize;
					// Do not count toward processed total
				} else if (ext === ".ttf" || ext === ".otf") {
					// Compress TTF/OTF to woff2
					console.log(`Compressing ${fontFile}...`);

					const fontmin = new Fontmin()
						.src(fontSrc)
						.use(
							Fontmin.glyph({
								text: text,
								hinting: false,
							}),
						)
						.use(
							Fontmin.ttf2woff2({
								clone: false,
								deflate: true,
							}),
						)
						.dest(distFontDir);

					await new Promise((resolve, reject) => {
						fontmin.run((err, files) => {
							if (err) {
								reject(err);
							} else {
								resolve(files);
							}
						});
					});

					// Verify compression output
					const compressedFile = path.join(
						distFontDir,
						`${baseName}.woff2`,
					);

					if (fs.existsSync(compressedFile)) {
						const compressedSize = fs.statSync(compressedFile).size;
						totalCompressedSize += compressedSize;
						const reduction = (
							(1 - compressedSize / originalSize) *
							100
						).toFixed(2);

						console.log(
							`✓ ${fontFile} → ${baseName}.woff2 (${(compressedSize / 1024).toFixed(2)} KB, reduced ${reduction}%)`,
						);
						processedCount++;
					}
				} else {
					console.log(
						`⚠ Unsupported font format, skipping: ${fontFile}`,
					);
				}
			}
		}

		// Print summary
		if (errors.length > 0) {
			console.log("\n❌ Font compression encountered errors!");
			console.log(`${errors.length} errors, please fix and retry.\n`);

			// List font files that exist on disk
			const fontDir = path.join(__dirname, "../public/assets/font");
			if (fs.existsSync(fontDir)) {
				const actualFiles = fs
					.readdirSync(fontDir)
					.filter((f) =>
						[".ttf", ".otf", ".woff", ".woff2"].includes(
							path.extname(f).toLowerCase(),
						),
					);

				if (actualFiles.length > 0) {
					console.log("Available font files:");
					actualFiles.forEach((f) => console.log(`  - ${f}`));
				} else {
					console.log("  (font directory is empty)");
				}
			}

			process.exit(1);
		}

		if (processedCount > 0) {
			const totalReduction = (
				(1 - totalCompressedSize / totalOriginalSize) *
				100
			).toFixed(2);
			console.log("\n✓ Font optimization complete!");
			console.log(
				`  Files processed: ${processedCount}, Overall reduction: ${totalReduction}%`,
			);
		} else {
			console.log("\n⚠ No font files processed");
		}
	} catch (error) {
		console.error("❌ Font compression failed:", error);
		process.exit(1);
	}
}

// Update dist CSS: replace ttf with woff2 after subsetting, or keep as-is
async function updateCssFontReferences() {
	try {
		const { fonts } = await getConfig();
		const distDir = path.join(__dirname, "../dist/");
		const publicFontDir = path.join(__dirname, "../public/assets/font");

		// Find all CSS files (including _astro)
		const cssFiles = [];
		function findCssFiles(dir) {
			if (!fs.existsSync(dir)) return;
			const files = fs.readdirSync(dir);
			files.forEach((file) => {
				const filePath = path.join(dir, file);
				const stat = fs.statSync(filePath);
				if (stat.isDirectory()) {
					findCssFiles(filePath);
				} else if (file.endsWith(".css")) {
					cssFiles.push(filePath);
				}
			});
		}
		findCssFiles(distDir);

		if (cssFiles.length === 0) {
			console.log("⚠ No CSS files found in dist");
			return;
		}

		for (const fontConfig of fonts) {
			for (const fontFile of fontConfig.files) {
				const ext = path.extname(fontFile).toLowerCase();
				const baseName = path.basename(fontFile, ext);
				const ttfFile = fontFile;
				const woff2File = `${baseName}.woff2`;

				// Check woff2 exists (from build or user-provided)
				const distWoff2 = path.join(
					__dirname,
					`../dist/assets/font/${woff2File}`,
				);
				const publicWoff2 = path.join(
					publicFontDir,
					`${baseName}.woff2`,
				);
				const hasWoff2 =
					fs.existsSync(distWoff2) || fs.existsSync(publicWoff2);

				if (!hasWoff2) {
					console.log(
						`⚠ No woff2 found for ${baseName}, keeping ttf reference`,
					);
					continue;
				}

				// Update each CSS file
				for (const cssFile of cssFiles) {
					let cssContent = fs.readFileSync(cssFile, "utf-8");
					const originalContent = cssContent;

					// Match @font-face src referencing this font
					// Match: url("/assets/font/xxx.ttf") or with format("truetype")
					const ttfPattern = new RegExp(
						`url\\(["']?/assets/font/${baseName}\\.ttf["']?\\)\\s*format\\(["']truetype["']\\)`,
						"g",
					);

					if (fontConfig.enableCompress) {
						// Subsetting enabled: replace with subset woff2
						cssContent = cssContent.replace(
							ttfPattern,
							`url("/assets/font/${woff2File}") format("woff2")`,
						);
					} else {
						// Subsetting off: use original woff2 if present, else ttf fallback
						if (fs.existsSync(publicWoff2)) {
							cssContent = cssContent.replace(
								ttfPattern,
								`url("/assets/font/${woff2File}") format("woff2"), url("/assets/font/${baseName}.ttf") format("truetype")`,
							);
						}
					}

					if (cssContent !== originalContent) {
						fs.writeFileSync(cssFile, cssContent);
						console.log(`✓ Updated CSS: ${cssFile} (${baseName})`);
					}
				}
			}
		}

		// Handle woff2 in font dir not listed in config
		// Scan public/font woff2 and matching ttf refs in CSS
		const publicFiles = fs.readdirSync(publicFontDir);
		for (const file of publicFiles) {
			if (file.endsWith(".woff2")) {
				const baseName = path.basename(file, ".woff2");
				const ttfFile = `${baseName}.ttf`;

				// Check whether CSS references this ttf
				for (const cssFile of cssFiles) {
					let cssContent = fs.readFileSync(cssFile, "utf-8");
					const ttfPattern = new RegExp(
						`url\\(["']?/assets/font/${baseName}\\.ttf["']?\\)\\s*format\\(["']truetype["']\\)`,
						"g",
					);

					if (cssContent.match(ttfPattern)) {
						// Replace with woff2 + ttf fallback
						cssContent = cssContent.replace(
							ttfPattern,
							`url("/assets/font/${file}") format("woff2"), url("/assets/font/${ttfFile}") format("truetype")`,
						);
						fs.writeFileSync(cssFile, cssContent);
						console.log(
							`✓ Updated CSS: ${cssFile} (${baseName} - woff2 fallback)`,
						);
					}
				}
			}
		}
	} catch (error) {
		console.error("⚠ CSS font reference update failed:", error.message);
		// Warn only; do not exit
	}
}

// Run compression
compressFonts().then(() => updateCssFontReferences());
