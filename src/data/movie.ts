// Local movie data configuration
export interface MovieItem {
	title: string;
	status: "watching" | "completed" | "planned";
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
}

const localMovieList: MovieItem[] = [
	{
		title: "Merz leck Eier",
		status: "completed",
		rating: 10.0,
		cover: "/assets/movie/Merz.png",
		description: "Freddy Merz leckt 2h lang Eier",
		episodes: "1 episode",
		year: "2026",
		genre: ["Action", "Science", "Politics"],
		studio: "Leck 1 Pictures",
		link: "https://youtu.be/jcB4zu4KX10?si=c-PX3ZB-8OUGZbeN",
		progress: 100,
		totalEpisodes: 1,
		startDate: "2026-04",
		endDate: "2026-05",
	},
];

export default localMovieList;
