import { Platform } from "obsidian";

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

export const isInsertLineDown = (e: React.KeyboardEvent) => {
	return e.shiftKey && e.key === "Enter";
};

export const isInsertLineAltDown = (e: React.KeyboardEvent) => {
	if (Platform.isMacOS) {
		return e.metaKey && e.key === "Enter";
	} else if (Platform.isWin || Platform.isLinux) {
		return e.altKey && e.key === "Enter";
	}
};
