# Album Feature Guide

The Mizuki theme album feature uses **automatic scanning** — create a folder, add images and a config file, and you're done. No manual code required (external-link albums need manual `src` and other fields per image).

## Quick Start

Create an album in 3 steps:

1. Create a folder under `public/images/albums/` (this directory). The folder name is the album ID.
2. Add `cover.jpg` (cover image) and other photos to the folder.
3. Create an `info.json` config file.

Done! The album appears automatically on the album list page.

## Directory Structure

```
public/images/albums/
├── my-travel-2024/              # Album folder (folder name = album ID)
│   ├── info.json                # Album config (required)
│   ├── cover.jpg                # Cover image (required)
│   ├── photo1.jpg               # Album photos
│   ├── photo2.jpg
│   └── photo3.jpg
├── daily-life/                  # Another album
│   ├── info.json
│   ├── cover.jpg
│   └── ...
└── README.md                    # This file
```

## Configuration

### Local Image Mode

Create `info.json` in the album folder:

```json
{
  "title": "My Travel Album",
  "description": "Summer 2024 memories",
  "date": "2024-08-01",
  "location": "Tokyo, Japan",
  "tags": ["travel", "landscape", "summer"],
  "layout": "masonry",
  "columns": 3,
  "hidden": false
}
```

**Field reference:**

| Field | Required | Description | Default |
|------|------|------|--------|
| `title` | Yes | Album title | Folder name |
| `description` | No | Album description | Empty |
| `date` | No | Album date (YYYY-MM-DD) | Current date |
| `location` | No | Shooting location | Empty |
| `tags` | No | Tag array | `[]` |
| `layout` | No | Layout: `grid` or `masonry` | `grid` |
| `columns` | No | Column count (2–4) | `3` |
| `hidden` | No | Hide album from list | `false` |

### External Link Mode

For external image URLs (e.g. image hosting), set `mode: "external"`:

```json
{
  "mode": "external",
  "title": "External Album Example",
  "description": "Album using external image links",
  "date": "2024-08-28",
  "location": "Online",
  "tags": ["external", "example"],
  "layout": "masonry",
  "columns": 3,
  "cover": "https://example.com/cover.jpg",
  "photos": [
    {
      "id": "photo-1",
      "src": "https://example.com/photo1.jpg",
      "alt": "Image description",
      "title": "Image title",
      "description": "Detailed description",
      "tags": ["tag1"],
      "width": 1920,
      "height": 1280
    }
  ]
}
```

**Additional fields for external mode:**

| Field | Required | Description |
|------|------|------|
| `mode` | Yes | Set to `"external"` to enable external mode |
| `cover` | Yes | Cover image URL (external mode only) |
| `photos` | Yes | Photo array; each photo needs `src`, `alt`, `title`, etc. See table below |

**Fields per photo in `photos` array (external mode only):**

| Field | Required | Description | Example |
|------|------|------|------|
| `id` | No | Unique photo ID | `"photo-1"` |
| `src` | Yes | Photo URL | `"https://example.com/photo.jpg"` |
| `thumbnail` | No | Thumbnail URL (uses original if omitted) | `"https://example.com/thumb.jpg"` |
| `alt` | No | Alt text (accessibility) | `"Beautiful sunset"` |
| `title` | No | Photo title | `"Sunset at the beach"` |
| `description` | No | Detailed description | `"Sunset shot at the beach, summer 2024"` |
| `tags` | No | Photo tag array | `["sunset", "beach"]` |
| `date` | No | Date taken (YYYY-MM-DD) | `"2024-08-01"` |
| `location` | No | Shooting location | `"Okinawa Beach"` |
| `width` | No | Width in pixels | `1920` |
| `height` | No | Height in pixels | `1280` |
| `camera` | No | Camera model | `"Canon EOS R5"` |
| `lens` | No | Lens model | `"RF 24-70mm F2.8"` |
| `settings` | No | Exposure settings (string) | `"f/2.8, 1/500s, ISO 100"` |

> **Note**:
> - Local mode **does not** need a `photos` field; the system scans all images in the folder
> - External mode **must** define a `photos` array with at least `src` per photo
> - Provide `thumbnail` for external photos to improve load speed

## Image Format Recommendations

### Cover Image (cover.jpg)
- **Size**: 800×600px (4:3)
- **Format**: JPG (external mode supports more formats)
- **File size**: under 200KB recommended

### Album Photos
- **Formats**: JPG, JPEG, PNG, WebP, GIF, SVG, AVIF
- **Size**: max width 1920px recommended
- **Optimization**: compress before upload for faster loading

## Layout Options

### Grid Layout
```json
{
  "layout": "grid",
  "columns": 3
}
```
- Best for uniform photo sizes
- Supports 2–4 columns
- Photos are cropped to squares

### Masonry Layout
```json
{
  "layout": "masonry",
  "columns": 3
}
```
- Best for varied photo sizes
- Preserves original aspect ratio
- Auto-arranged for a natural look

## Example Albums

The project includes sample albums:

### AcgExample
- **Local image mode** example
- Shows how to create an album with local images
- Masonry layout, 3 columns

### ExternalExample
- **External link mode** example (hidden by default)
- Shows external image URLs
- Useful with image hosting services

### HiddenExample
- **Hidden album** example
- Album not shown in the list
- Accessible via direct URL

## Advanced Features

### Filename Tags (Experimental)

Tags can be parsed from filenames (`basename_tag1_tag2.ext`):

```
photo_sunset_beach.jpg  →  tags: sunset, beach
```

### Hidden Albums

Set `"hidden": true` to hide from the list; still reachable by URL:

```
Visit: /albums/your-album-id/
```

## FAQ

**Q: Why doesn't my album show up?**  
A: Check for `info.json` and `cover.jpg`, and whether `hidden` is `true`.

**Q: Can I use other image formats?**  
A: Yes — JPG, PNG, WebP, GIF, SVG, AVIF, etc.

**Q: How do I improve load speed?**  
A: Compress images (WebP helps). For external mode, set thumbnails.

**Q: How do I change album sort order?**  
A: Albums sort by date; adjust the album `date` field to reorder.
