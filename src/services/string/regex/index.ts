export const TAG_REGEX = new RegExp(/^[#][^\s]+$/);

/**
 * Matches a number of at least 1 character e.g. '0'
 */
export const NUMBER_REGEX = new RegExp(/^\d+$/);

export const TAGS_REGEX = new RegExp(/#[^ \t]+/g);

//A measurement in pixels
//e.g. 10px
export const CSS_MEASUREMENT_PIXEL_REGEX = new RegExp(/^([1-9])([0-9]*)px$/);

/**
 * Matches a date with the format yyyy/mm/dd
 */
export const DATE_REGEX = new RegExp(/^\d{4}\/\d{2}\/\d{2}$/);

/**
 * Matches a markdown checkbox [ ] or [x]
 */
export const CHECKBOX_REGEX = new RegExp(/^\[[x ]{0,1}\]$/);

/**
 * Matches a checked markdown checkbox [x]
 */
export const CHECKBOX_CHECKED_REGEX = new RegExp(/^\[[x]\]$/);

/**
 * Matches a forward '/' or backslash '\'
 */
export const SLASH_REGEX = new RegExp(/\/|\\/);
