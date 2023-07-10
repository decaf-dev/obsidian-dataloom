export const CURRENT_PLUGIN_VERSION = "8.0.0";

export const DEFAULT_LOOM_NAME = "Untitled";

export const CURRENT_FILE_EXTENSION = "loom";

/**
 * Matches an extension with a leading period.
 * @example
 * .loom
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
