import type { Song } from "@/components/widgets/music-player/types";

/** Drop .mp3 files here (served from /public): */
export const LOCAL_MUSIC_URL_DIR = "public/assets/music/url";

/** Optional cover art (.webp/.jpg/.png): */
export const LOCAL_MUSIC_COVER_DIR = "public/assets/music/cover";

/**
 * Local playlist entries.
 * After adding a file to public/assets/music/url/, append a Song here.
 * URL paths are relative to /public (no "public/" prefix in url/cover fields).
 */
export const localMusicPlaylist: Song[] = [
	{
		id: 1,
		title: "Nightmare",
		artist: "Aviva",
		cover: "assets/music/cover/nightmare.png",
		url: "assets/music/url/nightmare.mp3",
		duration: 0,
	},
	{
		id: 2,
		title: "Bite Back",
		artist: "MEMBA feat. Nevve",
		cover: "assets/music/cover/bite-back.png",
		url: "assets/music/url/bite-back.mp3",
		duration: 0,
	},
];
