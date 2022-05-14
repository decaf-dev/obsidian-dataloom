/**
 * Matches an individual markdown cell
 * e.g. "\t thisismycell\t|""
 * Will match spaces, tabs, and ending pipe symbol
 *
 * We don't match the first pipe symbol because not every cell in a row will
 * have 2 pipes
 * @returns An array of matches
 */
export const MARKDOWN_CELLS_REGEX = new RegExp(
	/[ \t]{0,}[^|\r\n]+[ \t]{0,}\|/g
);

/**
 * Matches an individual markdown row
 * @returns An array of matches
 */
export const MARKDOWN_ROWS_REGEX = new RegExp(/(\|[ ]{0,}.*[ ]{0,}\|){1,}/g);

export const TAG_REGEX = new RegExp(/^#.[^\s]+$/);

/**
 * Matches an individual markdown hyphen cell
 * e.g. "\t ---\t|"
 * Will match spaces, tabs, and ending pipe symbol
 * We don't match the first pipe symbol because not every cell in a row will
 * have 2 pipes
 */
export const MARKDOWN_HYPHEN_CELL_REGEX = new RegExp(
	/[ \t]{0,}[-]{3,}[ \t]{0,}\|/
);

export const NUMBER_REGEX = new RegExp(/^\d+$/);

export const EXTERNAL_LINK_REGEX = new RegExp(/https{0,1}:\/\/[^\s]*/g);

export const TAGS_REGEX = new RegExp(/#[^ \t]+/g);

export const FILE_LINK_REGEX = new RegExp(/\[\[[^\n\r\]]+]]/g);

export const TABLE_ID_REGEX = new RegExp(/^table-id-[a-zA-Z0-9]{1,}$/);

export const ROW_ID_REGEX = new RegExp(/^row-id-[a-zA-Z0-9]{1,}$/);

export const COLUMN_ID_REGEX = new RegExp(/^column-id-[a-zA-Z0-9]{1,}$/);

/**
 * Matches a date with the format mm/dd/yyyy
 */
export const DATE_REGEX = new RegExp(/^\d{2}\/\d{2}\/\d{4}$/);

/**
 * Matches a markdown checkbox [ ] or [x]
 */
export const CHECKBOX_REGEX = new RegExp(/^\[[x ]{0,1}\]$/);

/**
 * Matches a checked markdown checkbox [x]
 */
export const CHECKBOX_CHECKED_REGEX = new RegExp(/^\[[x]\]$/);
