import { siteConfig } from "../config";

export function formatDateToYYYYMMDD(date: Date): string {
	return date.toISOString().substring(0, 10);
}

// Internationalized date formatting
export function formatDateI18n(dateString: string): string {
	const date = new Date(dateString);
	const lang = siteConfig.lang || "en";

	// Apply locale-specific date format options
	const options: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};

	// Language code to locale mapping
	const localeMap: Record<string, string> = {
		zh_CN: "zh-CN",
		zh_TW: "zh-TW",
		en: "en-US",
		ja: "ja-JP",
		ko: "ko-KR",
		es: "es-ES",
		th: "th-TH",
		vi: "vi-VN",
		tr: "tr-TR",
		id: "id-ID",
		fr: "fr-FR",
		de: "de-DE",
		ru: "ru-RU",
		ar: "ar-SA",
	};

	const locale = localeMap[lang] || "en-US";
	return date.toLocaleDateString(locale, options);
}
