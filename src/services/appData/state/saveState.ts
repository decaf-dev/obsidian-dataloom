import { TableModel } from "./types";

export type ViewType = "live-preview" | "reading";

export const VIEW_TYPE = {
	LIVE_PREVIEW: "live-preview",
	READING: "reading",
};
export interface SaveState {
	data: TableModel;
	viewType: ViewType;
	shouldUpdate: boolean;
	tableCacheVersion: number;
}
