import { AppSaveState } from "../appData/state/appSaveState";
import { TabbableElement } from "../appData/state/tabbableElement";
import { TABBABLE_ELEMENT_TYPE } from "src/app/constants";

export interface NltSettings {
	appData: { [filePath: string]: { [tableId: string]: AppSaveState } };
	focusedElement: TabbableElement;
}

export const DEFAULT_SETTINGS: NltSettings = {
	appData: {},
	focusedElement: { id: "-1", type: TABBABLE_ELEMENT_TYPE.UNFOCUSED },
};
