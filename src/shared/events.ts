const obsidianEvent = (name: string) => {
	return "nlt:" + name;
};

export const ADD_COLUMN_EVENT = obsidianEvent("add-column");
export const DELETE_COLUMN_EVENT = obsidianEvent("delete-column");
export const ADD_ROW_EVENT = obsidianEvent("add-row");
export const DELETE_ROW_EVENT = obsidianEvent("delete-row");
export const REFRESH_VIEW_EVENT = obsidianEvent("refresh-view");
