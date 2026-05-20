import getReadingTime from "reading-time";
import { visit } from "unist-util-visit";

export function remarkContent() {
	return (tree, { data }) => {
		// --- Safety check: ensure data.astro exists ---
		if (!data.astro) {
			data.astro = {};
		}
		if (!data.astro.frontmatter) {
			data.astro.frontmatter = {};
		}

		let fullText = ""; // For word count (full text)
		let excerpt = ""; // For excerpt storage

		// Define manual excerpt separator regex (supports <!-- more -->, case-insensitive)
		const moreTagRegex = /<!--\s*more\s*-->/i;
		let moreTagIndex = -1;

		// --- Traverse AST to find manual excerpt separator ---
		if (tree.children && Array.isArray(tree.children)) {
			moreTagIndex = tree.children.findIndex(
				(node) =>
					node.type === "html" &&
					node.value &&
					moreTagRegex.test(node.value),
			);
		}

		// --- Compute excerpt ---
		if (moreTagIndex !== -1) {
			// Extract all content before the separator
			const excerptNodes = tree.children.slice(0, moreTagIndex);
			excerpt = excerptNodes.map(getNodeText).join("");
		} else {
			// Extract first non-empty paragraph
			if (tree.children && Array.isArray(tree.children)) {
				for (const node of tree.children) {
					if (node.type === "paragraph") {
						const text = getNodeText(node);
						// Ensure extracted text is not whitespace-only
						if (text && text.trim().length > 0) {
							excerpt = text;
							break;
						}
					}
				}
			}
		}

		// --- Compute reading time ---
		visit(tree, (node) => {
			// Skip code blocks, do not count toward word count
			if (node.type === "code" || node.type === "inlineCode") {
				return "skip";
			}

			// Accumulate text
			if (node.type === "text" && node.value) {
				fullText += node.value + " ";
			}
		});

		// Word count optimization for CJK (Chinese, Japanese, Korean) characters
		const cjkPattern =
			/[\u4e00-\u9fa5\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af\u3000-\u303f\uff00-\uffef]/g;

		const cjkMatches = fullText.match(cjkPattern);
		const cjkCount = cjkMatches ? cjkMatches.length : 0;

		// Replace CJK chars with spaces to avoid merging, then count non-CJK (English/numbers) words
		const nonCjkText = fullText.replace(cjkPattern, " ");
		const nonCjkStats = getReadingTime(nonCjkText);

		const totalWords = nonCjkStats.words + cjkCount;

		// Estimate time: English 200 words/min, Chinese 400 chars/min
		const minutes = nonCjkStats.words / 200 + cjkCount / 400;

		// --- Inject data into frontmatter ---
		data.astro.frontmatter.excerpt = excerpt;
		data.astro.frontmatter.minutes = Math.max(1, Math.round(minutes));
		data.astro.frontmatter.words = totalWords;
	};
}

/**
 * Helper: recursively extract plain text from a node
 */
function getNodeText(node) {
	// Safety check
	if (!node) {
		return "";
	}

	// Return text nodes directly
	if (node.type === "text") {
		return node.value || "";
	}

	// For images, extract alt text (optional; included here to preserve semantics)
	if (node.type === "image") {
		return node.alt || "";
	}

	// Skip code blocks and HTML tags
	if (
		node.type === "code" ||
		node.type === "inlineCode" ||
		node.type === "html"
	) {
		return "";
	}

	// Recursively process child nodes
	if (node.children && Array.isArray(node.children)) {
		return node.children.map(getNodeText).join("");
	}

	return "";
}
