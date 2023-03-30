import NltPlugin from "../../main";

export const FILE_NAME = "serialize";

export const updateSortTime = async (plugin: NltPlugin, tableId: string) => {
	const settingsCopy = { ...plugin.settings };
	settingsCopy.viewModeSync = {
		tableId,
		viewModes: ["source", "preview"],
		eventType: "sort-rows",
	};
	plugin.settings = settingsCopy;
	return await plugin.saveData(plugin.settings);
};
