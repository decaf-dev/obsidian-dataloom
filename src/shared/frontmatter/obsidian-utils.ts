import { App } from "obsidian";
import { ObsidianPropertyType } from "./types";

export const updateObsidianPropertyType = async (
	app: App,
	name: string,
	type: ObsidianPropertyType
) => {
	return (app as any).metadataTypeManager.setType(name, type);
};

export const getAllObsidianProperties = async (app: App) => {
	return (app as any).metadataTypeManager.getAllProperties();
};
