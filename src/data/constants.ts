export const DEFAULT_LOOM_NAME = "Untitled";

export const LOOM_EXTENSION = "loom";

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
