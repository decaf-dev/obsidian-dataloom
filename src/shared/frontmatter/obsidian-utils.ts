import { App } from "obsidian";

export const updateObsidianPropertyType = async (
	app: App,
	name: string,
	type: string
) => {
	return (app as any).metadataTypeManager.setType(name, type);
};

export const getAllObsidianProperties = async (app: App) => {
	return (app as any).metadataTypeManager.getAllProperties();
};
