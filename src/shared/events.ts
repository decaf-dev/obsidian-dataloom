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

/**
 * Event for when a vault file's frontmatter is changed
 */
export const EVENT_FILE_FRONTMATTER_CHANGE = obsidianEvent(
	"file-frontmatter-change"
);

/**
 * Event for when a file is deleted
 */
export const EVENT_FILE_DELETE = obsidianEvent("file-delete");

/**
 * Event for when a folder is deleted
 */
export const EVENT_FOLDER_DELETE = obsidianEvent("folder-delete");

/**
 * Event for when a vault folder is renamed
 */
export const EVENT_FOLDER_RENAME = obsidianEvent("folder-rename");

/**
 * Event for when a vault file is renamed
 */
export const EVENT_FILE_RENAME = obsidianEvent("file-rename");

/**
 * Event for when a vault file is created
 */
export const EVENT_FILE_CREATE = obsidianEvent("file-create");

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
