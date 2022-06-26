import { TabbableElement } from "../appData/state/tabbableElement";
import { TABBABLE_ELEMENT_TYPE } from "src/app/constants";
import { saveState } from "../appData/state/saveState";
import { AppData } from "../appData/state/appData";

export interface NltSettings {
	appData: {
		[sourcePath: string]: {
			[tableIndex: string]: AppData;
		};
	};
	state: {
		[sourcePath: string]: {
			[tableIndex: string]: saveState;
		};
	};
	focusedElement: TabbableElement;
}

export const DEFAULT_SETTINGS: NltSettings = {
	appData: {},
	state: {},
	focusedElement: { id: "-1", type: TABBABLE_ELEMENT_TYPE.UNFOCUSED },
};
