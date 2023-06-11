export const CURRENT_PLUGIN_VERSION = "6.18.4";

export const DEFAULT_TABLE_NAME = "Untitled";

export const TABLE_EXTENSION = "table";

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
