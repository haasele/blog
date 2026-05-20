import fs from "node:fs";
import path from "node:path";

import localMovieList from "../data/movie";
import I18nKey from "../i18n/i18nKey";
import { i18n } from "../i18n/translation";

export interface RawMovieItem {
	title?: string;
	cover?: string;
	link?: string;
	status?: string;
	rating?: number | string;
	progress?: number | string;
	totalEpisodes?: number | string;
	description?: string;
	year?: string;
	studio?: string;
	genre?: string[];
}

export interface MovieItem {
	title: string;
	cover: string;
	link: string;
	status: string;
	rating: number;
	progress: number;
	totalEpisodes: number;
	description: string;
	year: string;
	studio: string;
	genre: string[];
}

export type MovieSourceConfig =
	| { type: "local"; data: MovieItem[] }
	| {
			type: "json";
			filename: string;
			fetchOnDev?: boolean;
			emptyDescription?: string;
	  };

export function loadMovieData(filename: string): MovieItem[] {
	const dataPath = path.join(process.cwd(), `src/data/${filename}`);

	if (!fs.existsSync(dataPath)) {
		console.warn(`[Movie] Data file not found: ${dataPath}`);
		return [];
	}

	try {
		const fileContent = fs.readFileSync(dataPath, "utf-8");
		const rawData = JSON.parse(fileContent) as RawMovieItem[];

		return rawData.map((item) => ({
			title: item.title || "Unknown",
			cover: item.cover || "",
			link: item.link || "",
			status: item.status || "planned",
			rating: Number(item.rating) || 0,
			progress: Number(item.progress) || 0,
			totalEpisodes: Number(item.totalEpisodes) || 12,
			description: item.description || "",
			year: item.year || "",
			studio: item.studio || "",
			genre: Array.isArray(item.genre) ? item.genre : [],
		}));
	} catch (error) {
		console.error(`[Movie] Failed to parse ${filename}:`, error);
		return [];
	}
}

export function getMovieSourceConfigs(): Record<string, MovieSourceConfig> {
	return {
		local: {
			type: "local",
			data: localMovieList,
		},
		bilibili: {
			type: "json",
			filename: "bilibili-data.json",
			fetchOnDev: undefined,
			emptyDescription: i18n(I18nKey.movieEmptyBilibili),
		},
		bangumi: {
			type: "json",
			filename: "bangumi-data.json",
			fetchOnDev: undefined,
			emptyDescription: i18n(I18nKey.movieEmptyBangumi),
		},
	};
}

export function getMovieList(
	mode: string,
	sourceConfigs: Record<string, MovieSourceConfig>,
): { movieList: MovieItem[]; currentConfig: MovieSourceConfig | undefined } {
	let movieList: MovieItem[] = [];
	const currentConfig = sourceConfigs[mode];

	if (currentConfig) {
		if (currentConfig.type === "local") {
			movieList = currentConfig.data;
		} else if (currentConfig.type === "json") {
			const isDev = import.meta.env.DEV;
			const shouldFetchOnDev = currentConfig.fetchOnDev ?? false;
			const skipLoad = isDev && !shouldFetchOnDev;

			if (skipLoad) {
				console.log(
					`[Dev] Skipping ${mode} data load (fetchOnDev is off).`,
				);
				movieList = [];
			} else {
				movieList = loadMovieData(currentConfig.filename);
			}
		}
	} else {
		console.warn(`[Movie] Unknown or unconfigured mode: ${mode}`);
	}

	return { movieList, currentConfig };
}

export function getStatusMap(): Record<
	string,
	{ text: string; class: string; icon: string }
> {
	return {
		watching: {
			text: i18n(I18nKey.movieStatusWatching),
			class: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
			icon: "▶",
		},
		completed: {
			text: i18n(I18nKey.movieStatusCompleted),
			class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
			icon: "✓",
		},
		planned: {
			text: i18n(I18nKey.movieStatusPlanned),
			class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
			icon: "❤",
		},
		onhold: {
			text: i18n(I18nKey.movieStatusOnHold),
			class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
			icon: "⏸",
		},
		dropped: {
			text: i18n(I18nKey.movieStatusDropped),
			class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
			icon: "✗",
		},
	};
}
