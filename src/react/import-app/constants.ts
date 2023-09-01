/**
 * Matches a single markdown list item
 * @example
 * - This is a list item
 */
export const MARKDOWN_LIST_ITEM_REGEX = new RegExp(/^([ \t]*-[\t ]+.+)$/);
