const obsidianEvent = (name: string) => {
	return "nlt:" + name;
};

export const EVENT_COLUMN_ADD = obsidianEvent("add-column");
export const EVENT_COLUMN_DELETE = obsidianEvent("delete-column");
export const EVENT_ROW_ADD = obsidianEvent("add-row");
export const EVENT_ROW_DELETE = obsidianEvent("delete-row");
export const EVENT_REFRESH_VIEW = obsidianEvent("refresh-view");
export const EVENT_DOWNLOAD_CSV = obsidianEvent("download-csv");
export const EVENT_DOWNLOAD_MARKDOWN = obsidianEvent("download-markdown");
