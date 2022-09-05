import { TabbableElement } from "../state/tabbableElement";
import { TABBABLE_ELEMENT_TYPE } from "src/constants";
import { SaveState } from "../state/saveState";
import { AppData } from "../state/types";

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
	focusedElement: TabbableElement;
	excludedFiles: string[];
}

export const DEFAULT_SETTINGS: NltSettings = {
	appData: {},
	state: {},
	sectionInfo: {
		lineStart: -1,
		lineEnd: -1,
	},
	focusedElement: { id: "-1", type: TABBABLE_ELEMENT_TYPE.UNFOCUSED },
	excludedFiles: [],
};
