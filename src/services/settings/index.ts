import { SaveState } from "../state/saveState";
import { AppData } from "../table/types";

export interface NltSettings {
	appData: {
		[sourcePath: string]: {
			[tableIndex: string]: AppData;
		};
	};
	state: {
		[sourcePath: string]: {
			[tableIndex: string]: SaveState;
		};
	};
	sectionInfo: {
		lineStart: number;
		lineEnd: number;
	};
}

export const DEFAULT_SETTINGS: NltSettings = {
	appData: {},
	state: {},
	sectionInfo: {
		lineStart: -1,
		lineEnd: -1,
	},
};
