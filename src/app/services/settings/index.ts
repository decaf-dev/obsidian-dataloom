import { AppData } from "../appData/state/appData";
import { TabbableElement } from "../appData/state/tabbableElement";
import { TABBABLE_ELEMENT_TYPE } from "src/app/constants";

export interface NltSettings {
	appData: { [filePath: string]: { [tableId: string]: AppData } };
	focusedElement: TabbableElement;
}

export const DEFAULT_SETTINGS: NltSettings = {
	appData: {},
	focusedElement: { id: "-1", type: TABBABLE_ELEMENT_TYPE.UNFOCUSED },
};
