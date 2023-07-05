export const CURRENT_PLUGIN_VERSION = "7.0.1";

export const DEFAULT_TABLE_NAME = "Untitled";

export const PREVIOUS_FILE_EXTENSION = "table";
export const CURRENT_FILE_EXTENSION = "dashboard";

/**
 * Matches an extension with a leading period.
 * @example
 * .table
 */
export const EXTENSION_REGEX = new RegExp(/\.[a-z]*$/);

/**
 * Matches all wiki links
 * @example
 * [[my-file]]
 * @example
 * [[my-file|alias]]
 * @example
 * [[my-file|]]
 */
export const WIKI_LINK_REGEX = new RegExp(/\[\[([^|\]]+)(?:\|([\w-]+))?\]\]/g);
