/**
 * Matches a number.
 * The number can be a whole number, a decimal, or a negative number.
 * @example
 * 1
 * @example
 * 22.05
 * @example
 * -5.0
 */
export const NUMBER_REGEX = new RegExp(/^-?\d+\.?\d*$/);

/**
 * Matches a empty string, a minus sign, or a number
 * @example
 * ""
 * @example
 * "-"
 * @example
 * "-22.05"
 */
export const NUMBER_INPUT_REGEX = new RegExp(/(^$)|(^-$)|(^-?\d+\.?\d*$)/);

/**
 * Matches a measurement in pixels
 * @example
 * 10px
 */
export const CSS_MEASUREMENT_PIXEL_REGEX = new RegExp(/^([1-9])([0-9]*)px$/);

/**
 * Matches a date with the format yyyy/mm/dd
 * @example
 * 2023/01/01
 */
export const DATE_REGEX = new RegExp(/^\d{4}\/\d{2}\/\d{2}$/);

/**
 * Matches a markdown checkbox
 * @example
 * [ ] or [x]
 */
export const CHECKBOX_REGEX = new RegExp(/^\[[x ]{0,1}\]$/);

/**
 * Matches a checked markdown checkbox
 * @example
 * [x]
 */
export const CHECKBOX_CHECKED_REGEX = new RegExp(/^\[[x]\]$/);

/**
 * Matches a URL
 * @example
 * http://example.com
 * https://www.example.com
 * http://subdomain.example.com
 * https://subdomain.example.com/path
 * http://www.example.com/?key=value
 * https://www.example.com/path/?key=value&key2=value2
 */
export const URL_REGEX = new RegExp(
	/^https?:\/\/([\w.-]+\.)?[\w.-]+\.[a-zA-Z]{2,}(\/[\w.-]+)*(\/?(\?[\w.-]+=[\w.-]+(&[\w.-]+=[\w.-]+)*)?)?$/i
);
