import * as fs from "node:fs";
import * as path from "node:path";

import type { AlbumGroup, Photo } from "../types/album";

export async function scanAlbums(): Promise<AlbumGroup[]> {
	const albumsDir = path.join(process.cwd(), "public/images/albums");
	const albums: AlbumGroup[] = [];

	// Check whether the albums directory exists
	if (!fs.existsSync(albumsDir)) {
		console.warn("Albums directory does not exist:", albumsDir);
		return [];
	}

	// Read all subfolders
	const albumFolders = fs
		.readdirSync(albumsDir, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	// Process each album folder
	for (const folder of albumFolders) {
		const albumPath = path.join(albumsDir, folder);
		const album = await processAlbumFolder(albumPath, folder);
		if (album) {
			albums.push(album);
		}
	}

	return albums;
}

async function processAlbumFolder(
	folderPath: string,
	folderName: string,
): Promise<AlbumGroup | null> {
	// Check required files
	const infoPath = path.join(folderPath, "info.json");

	if (!fs.existsSync(infoPath)) {
		console.warn(`Album ${folderName} is missing info.json`);
		return null;
	}

	// Read album metadata
	const infoContent = fs.readFileSync(infoPath, "utf-8");
	let info: Record<string, any>;
	try {
		info = JSON.parse(infoContent);
	} catch (e) {
		console.error(`Album ${folderName} has invalid info.json:`, e);
		return null;
	}

	// Check for external-link mode
	const isExternalMode = info.mode === "external";
	let photos: Photo[] = [];
	let cover: string;

	if (isExternalMode) {
		// External mode: read cover and photos from info.json
		if (!info.cover) {
			console.warn(`Album ${folderName} (external mode) is missing cover`);
			return null;
		}

		cover = info.cover;
		photos = processExternalPhotos(info.photos || [], folderName);
	} else {
		// Local mode: validate local files
		let coverPath = path.join(folderPath, "cover.webp");
		const hasWebpCover = fs.existsSync(coverPath);
		if (!hasWebpCover) {
			coverPath = path.join(folderPath, "cover.jpg");
			if (!fs.existsSync(coverPath)) {
				console.warn(`Album ${folderName} is missing cover file`);
				return null;
			}
		}

		cover = hasWebpCover
			? `/images/albums/${folderName}/cover.webp`
			: `/images/albums/${folderName}/cover.jpg`;
		photos = scanPhotos(folderPath, folderName);
	}

	// Skip hidden albums
	if (info.hidden === true) {
		console.log(`Album ${folderName} is hidden; skipping`);
		return null;
	}

	// Build album object
	return {
		id: folderName,
		title: info.title || folderName,
		description: info.description || "",
		cover,
		date: info.date || new Date().toISOString().split("T")[0],
		location: info.location || "",
		tags: info.tags || [],
		photos,
	};
}

function scanPhotos(folderPath: string, albumId: string): Photo[] {
	const photos: Photo[] = [];
	const files = fs.readdirSync(folderPath);

	const imageExtensions = [
		".jpg",
		".jpeg",
		".png",
		".gif",
		".webp",
		".svg",
		".avif",
		".bmp",
		".tiff",
		".tif",
	];

	const imageFiles = files.filter((file) => {
		const ext = path.extname(file).toLowerCase();
		return (
			imageExtensions.includes(ext) &&
			file !== "cover.jpg" &&
			file !== "cover.webp"
		);
	});

	const fileWebpMap = new Map<string, string>();
	for (const file of imageFiles) {
		const baseName = path.basename(file, path.extname(file));
		const ext = path.extname(file).toLowerCase();
		if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
			if (imageFiles.includes(baseName + ".webp")) {
				fileWebpMap.set(file, baseName + ".webp");
			}
		}
	}

	imageFiles.forEach((file, index) => {
		const filePath = path.join(folderPath, file);
		const stats = fs.statSync(filePath);

		const { baseName, tags } = parseFileName(file);

		const src = fileWebpMap.has(file)
			? `/images/albums/${albumId}/${fileWebpMap.get(file)}`
			: `/images/albums/${albumId}/${file}`;

		photos.push({
			id: `${albumId}-photo-${index}`,
			src,
			alt: baseName,
			title: baseName,
			tags: tags,
			date: stats.mtime.toISOString().split("T")[0],
		});
	});

	return photos;
}

function processExternalPhotos(
	externalPhotos: any[],
	albumId: string,
): Photo[] {
	const photos: Photo[] = [];

	externalPhotos.forEach((photo, index) => {
		if (!photo.src) {
			console.warn(
				`Album ${albumId}: photo ${index + 1} is missing src`,
			);
			return;
		}

		photos.push({
			id: photo.id || `${albumId}-external-photo-${index}`,
			src: photo.src,
			thumbnail: photo.thumbnail,
			alt: photo.alt || photo.title || `Photo ${index + 1}`,
			title: photo.title,
			description: photo.description,
			tags: photo.tags || [],
			date: photo.date || new Date().toISOString().split("T")[0],
			location: photo.location,
			width: photo.width,
			height: photo.height,
			// camera: photo.camera,
			// lens: photo.lens,
			// settings: photo.settings,
		});
	});

	return photos;
}

function parseFileName(fileName: string): { baseName: string; tags: string[] } {
	// Match tags embedded in the filename: name_tag1_tag2.ext
	const parts = path.basename(fileName, path.extname(fileName)).split("_");

	if (parts.length > 1) {
		// First segment is the base name; remaining segments are tags
		const baseName = parts.slice(0, -2).join("_");
		const tags = parts.slice(-2);
		return { baseName, tags };
	}

	// When no tags are present, return the filename without extension
	const baseName = path.basename(fileName, path.extname(fileName));
	return { baseName, tags: [] };
}
