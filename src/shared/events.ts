const obsidianEvent = (name: string) => {
	return "dataloom-" + name;
};

/**
 * Event for when the column add hotkey is pressed
 */
export const EVENT_COLUMN_ADD = obsidianEvent("add-column");

/**
 * Event for when the column delete hotkey is pressed
 */
export const EVENT_COLUMN_DELETE = obsidianEvent("delete-column");

/**
 * Event for when the row add hotkey is pressed
 */
export const EVENT_ROW_ADD = obsidianEvent("add-row");

/**
 * Event for when the row delete hotkey is pressed
 */
export const EVENT_ROW_DELETE = obsidianEvent("delete-row");

/**
 * Event for when a dataloom file is changed
 */
export const EVENT_APP_REFRESH = obsidianEvent("app-refresh");

export const EVENT_REFRESH_EDITING_VIEW = obsidianEvent("refresh-editing-view");

/**
 * Event for handling the global Obsidian click event
 */
export const EVENT_GLOBAL_CLICK = obsidianEvent("global-click");

/**
 * Event for handling the global Obsidian keydown event
 */
export const EVENT_GLOBAL_KEYDOWN = obsidianEvent("global-keydown");

/**
 * Event for when the download csv command is executed
 */
export const EVENT_DOWNLOAD_CSV = obsidianEvent("download-csv");

/**
 * Event for when the download markdown command is executed
 */
export const EVENT_DOWNLOAD_MARKDOWN = obsidianEvent("download-markdown");
