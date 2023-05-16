export const isWindowsRedo = (e: KeyboardEvent) => e.ctrlKey && e.key === "y";

export const isWindowsUndo = (e: KeyboardEvent) => e.ctrlKey && e.key === "z";

export const isMacRedo = (e: KeyboardEvent) =>
	e.metaKey && e.shiftKey && e.key === "z";

export const isMacUndo = (e: KeyboardEvent) => e.metaKey && e.key === "z";
