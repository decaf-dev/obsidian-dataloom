export const TAG_REGEX = new RegExp(/^[#][^\s]+$/);

/**
 * Matches both whole numbers and decimals
 */
export const NUMBER_REGEX = new RegExp(/^\d+\.?\d*$/);

export const TAGS_REGEX = new RegExp(/#[^ \t]+/g);

//A measurement in pixels
//e.g. 10px
export const CSS_MEASUREMENT_PIXEL_REGEX = new RegExp(/^([1-9])([0-9]*)px$/);

/**
 * Matches a date with the format yyyy/mm/dd
 */
export const DATE_REGEX = new RegExp(/^\d{4}\/\d{2}\/\d{2}$/);

/**
 * Matches a markdown checkbox
 * [ ] or [x]
 */
export const CHECKBOX_REGEX = new RegExp(/^\[[x ]{0,1}\]$/);

/**
 * Matches a checked markdown checkbox
 * [x]
 */
export const CHECKBOX_CHECKED_REGEX = new RegExp(/^\[[x]\]$/);

/**
 * Matches a forward or backslash
 * / or \
 */
export const SLASH_REGEX = new RegExp(/\/|\\/);

/**
 * Matches all internal links
 * [[File Name]]
 */
export const INTERNAL_LINK_REGEX = new RegExp(/\[\[[^\\\[\]]+\]\]/, "g");

/**
 * Matches an internal link alias
 * |alias
 */
export const INTERNAL_LINK_ALIAS_REGEX = new RegExp(/\|[^\n\r\]]+/);

/**
 * Matches all left square brackets
 * [
 */
export const LEFT_SQUARE_BRACKET_REGEX = new RegExp(/\[/, "g");

/**
 * Matches all right square brackets
 * ]
 */
export const RIGHT_SQUARE_BRACKET_REGEX = new RegExp(/\]/, "g");

/**
 * Matches all external links
 * e.g. https://www.google.com
 */
export const EXTERNAL_LINK_REGEX = new RegExp(/http[s]{0,1}:\/\/[^\s]+/, "g");
