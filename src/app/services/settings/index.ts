import { TabbableElement } from "../appData/state/tabbableElement";
import { TABBABLE_ELEMENT_TYPE } from "src/app/constants";
import { saveData } from "../appData/state/saveData";

export interface NltSettings {
	appData: {
		[sourcePath: string]: {
			[tableId: string]: saveData;
		};
	};
	focusedElement: TabbableElement;
}

export const DEFAULT_SETTINGS: NltSettings = {
	appData: {},
	focusedElement: { id: "-1", type: TABBABLE_ELEMENT_TYPE.UNFOCUSED },
};
