import NltPlugin from "../../main";
import { logVar } from "../debug";

export const FILE_NAME = "serialize";

export const updateSortTime = async (plugin: NltPlugin, tableId: string) => {
	const shouldDebug = plugin.settings.shouldDebug;
	const settingsCopy = { ...plugin.settings };
	settingsCopy.viewModeSync = {
		tableId,
		viewModes: ["source", "preview"],
		eventType: "sort-rows",
	};
	logVar(
		shouldDebug,
		FILE_NAME,
		"updateSortTime",
		"Updating settings file with new sync info",
		settingsCopy
	);
	plugin.settings = settingsCopy;
	return await plugin.saveData(plugin.settings);
};
