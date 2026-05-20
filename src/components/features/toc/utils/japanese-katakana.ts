/**
 * Japanese katakana character set
 * Used for TOC badge display
 */

/**
 * Complete Japanese katakana set (46 characters)
 * Ordered by gojuon rows
 */
export const JAPANESE_KATAKANA = [
	// A-row
	"ア",
	"イ",
	"ウ",
	"エ",
	"オ",
	// Ka-row
	"カ",
	"キ",
	"ク",
	"ケ",
	"コ",
	// Sa-row
	"サ",
	"シ",
	"ス",
	"セ",
	"ソ",
	// Ta-row
	"タ",
	"チ",
	"ツ",
	"テ",
	"ト",
	// Na-row
	"ナ",
	"ニ",
	"ヌ",
	"ネ",
	"ノ",
	// Ha-row
	"ハ",
	"ヒ",
	"フ",
	"ヘ",
	"ホ",
	// Ma-row
	"マ",
	"ミ",
	"ム",
	"メ",
	"モ",
	// Ya-row
	"ヤ",
	"ユ",
	"ヨ",
	// Ra-row
	"ラ",
	"リ",
	"ル",
	"レ",
	"ロ",
	// Wa-row
	"ワ",
	"ヲ",
	"ン",
] as const;

export type JapaneseKatakanaChar = (typeof JAPANESE_KATAKANA)[number];

/**
 * Get TOC badge text
 * @param index - Index (0-based)
 * @param useJapanese - Whether to use Japanese characters
 * @returns Badge text
 */
export function getKatakanaBadge(index: number, useJapanese: boolean): string {
	if (useJapanese && index < JAPANESE_KATAKANA.length) {
		return JAPANESE_KATAKANA[index];
	}
	return (index + 1).toString();
}

/**
 * Number of available Japanese characters
 */
export const KATAKANA_COUNT = JAPANESE_KATAKANA.length;
