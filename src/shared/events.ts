const obsidianEvent = (name: string) => {
	return "notion-like-tables-" + name;
};

export const EVENT_COLUMN_ADD = obsidianEvent("add-column");
export const EVENT_COLUMN_DELETE = obsidianEvent("delete-column");
export const EVENT_ROW_ADD = obsidianEvent("add-row");
export const EVENT_ROW_DELETE = obsidianEvent("delete-row");
export const EVENT_REFRESH_TABLES = obsidianEvent("refresh-tables");
export const EVENT_DOWNLOAD_CSV = obsidianEvent("download-csv");
export const EVENT_DOWNLOAD_MARKDOWN = obsidianEvent("download-markdown");
