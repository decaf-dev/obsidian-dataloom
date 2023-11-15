import { App } from "obsidian";
import { ObsidianPropertyType } from "./types";

/**
 * Updates the type of an existing Obsidian property.
 * NOTE: This is an undocumented API function and may break in future versions of Obsidian
 */
export const updateObsidianPropertyType = (
	app: App,
	name: string,
	type: ObsidianPropertyType
): Promise<void> => {
	return (app as any).metadataTypeManager.setType(name, type);
};

/**
 * Gets all Obsidian properties.
 * NOTE: This is an undocumented API function and may break in future versions of Obsidian
 */
export const getAllObsidianProperties = (app: App) => {
	return (app as any).metadataTypeManager.getAllProperties();
};

/**
 * Gets the type of an Obsidian property.
 * NOTE: This is an undocumented API function and may break in future versions of Obsidian
 */
export const getAssignedPropertyType = (app: App, name: string) => {
	return (app as any).metadataTypeManager.getAssignedType(name);
};
