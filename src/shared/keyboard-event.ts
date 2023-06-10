/**
 * Checks if undo keys for Windows are being pressed
 * @param e the keyboard event
 */
export const isWindowsUndoDown = (e: React.KeyboardEvent) =>
	e.ctrlKey && e.key === "z";

/**
 * Checks if redo keys for Windows are being pressed
 * @param e the keyboard event
 */
export const isWindowsRedoDown = (e: React.KeyboardEvent) =>
	e.ctrlKey && e.key === "y";

/**
 * Checks if undo keys for MacOS are being pressed
 * @param e the keyboard event
 */
export const isMacUndoDown = (e: React.KeyboardEvent) =>
	e.metaKey && e.key === "z";

/**
 * Checks if redo keys for MacOS are being pressed
 * @param e the keyboard event
 */
export const isMacRedoDown = (e: React.KeyboardEvent) =>
	e.metaKey && e.shiftKey && e.key === "z";

/**
 * Checks if a special action is being performed
 * @param e the keyboard event
 */
export const isSpecialActionDown = (e: KeyboardEvent | React.KeyboardEvent) =>
	e.shiftKey;
