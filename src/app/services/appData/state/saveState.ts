import { AppData } from "./appData";

export type ViewType = "live-preview" | "reading";

export const VIEW_TYPE = {
	LIVE_PREVIEW: "live-preview",
	READING: "reading",
};
export interface SaveState {
	data: AppData;
	viewType: ViewType;
	shouldUpdate: boolean;
	tableCacheVersion: number;
}
