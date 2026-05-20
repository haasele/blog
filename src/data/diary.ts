// Diary data configuration
// Data for the diary page

export interface DiaryItem {
	id: number;
	content: string;
	date: string;
	images?: string[];
	location?: string;
	mood?: string;
	tags?: string[];
}

// Sample diary entries
const diaryData: DiaryItem[] = [
	{
		id: 1,
		content:
			"The falling speed of cherry blossoms is five centimeters per second!",
		date: "2025-01-15T10:30:00Z",
		images: ["/images/diary/sakura.jpg", "/images/diary/1.webp"],
	},
];

// Get diary list (newest first)
export const getDiaryList = (limit?: number) => {
	const sortedData = [...diaryData].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);

	if (limit && limit > 0) {
		return sortedData.slice(0, limit);
	}

	return sortedData;
};

// Get all tags
export const getAllTags = () => {
	const tags = new Set<string>();
	diaryData.forEach((item) => {
		if (item.tags) {
			item.tags.forEach((tag) => tags.add(tag));
		}
	});
	return Array.from(tags).sort();
};
