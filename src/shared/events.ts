const obsidianEvent = (name: string) => {
	return "dashboards-" + name;
};

export const EVENT_COLUMN_ADD = obsidianEvent("add-column");
export const EVENT_COLUMN_DELETE = obsidianEvent("delete-column");
export const EVENT_ROW_ADD = obsidianEvent("add-row");
export const EVENT_ROW_DELETE = obsidianEvent("delete-row");
export const EVENT_REFRESH_APP = obsidianEvent("refresh-app");
export const EVENT_REFRESH_EDITING_VIEW = obsidianEvent("refresh-editing-view");
export const EVENT_OUTSIDE_CLICK = obsidianEvent("outside-click");
export const EVENT_OUTSIDE_KEYDOWN = obsidianEvent("outside-keydown");
export const EVENT_DOWNLOAD_CSV = obsidianEvent("download-csv");
export const EVENT_DOWNLOAD_MARKDOWN = obsidianEvent("download-markdown");
