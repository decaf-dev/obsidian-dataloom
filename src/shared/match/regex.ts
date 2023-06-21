/**
 * Matches a number.
 * The number can be a whole number, a decimal, or a negative number.
 * @example
 * 1
 * 22.05
 * -5.0
 */
export const NUMBER_REGEX = new RegExp(/^-?\d+\.?\d*$/);

/**
 * Matches a empty string, a minus sign, or a number
 * @example
 * ""
 * "-"
 * "-22.05"
 */
export const NUMBER_INPUT_REGEX = new RegExp(/(^$)|(^-$)|(^-?\d+\.?\d*$)/);

/**
 * Matches a date with the format yyyy/mm/dd
 * @example
 * 2023/01/01
 */
export const DATE_REGEX = new RegExp(/^\d{4}\/\d{2}\/\d{2}$/);

/**
 * Matches a markdown checkbox
 * @example
 * [ ]
 * [x]
 */
export const CHECKBOX_REGEX = new RegExp(/^\[[x ]{0,1}\]$/);

/**
 * Matches a checked markdown checkbox
 * @example
 * [x]
 */
export const CHECKBOX_CHECKED_REGEX = new RegExp(/^\[[x]\]$/);

/**
 * Matches an image extension
 * @example
 * image.jpg
 * image.jpeg
 * image.png
 * image.gif
 * image.bmp
 * image.tiff
 * image.ico
 * image.webp
 */
export const IMAGE_EXTENSION_REGEX = new RegExp(
	/\.(jpe?g|png|gif|bmp|tiff?|ico|webp)$/i
);

/**
 * Matches a YouTube link or short link
 */
export const YOUTUBE_LINK_REGEX = new RegExp(
	/^https?:\/\/(?:www\.)?(?:youtube\.com\/\S+|youtu\.be\/\S+)$/
);

/**
 * Matches a Twitter link or short link
 */
export const TWITTER_LINK_REGEX = new RegExp(
	/^https?:\/\/(?:www\.)?twitter\.com\/\S+|\bt\.co\/\S+$/
);
