import { normalizePath } from "obsidian";

export const getObsidianConfigValue = async (key: string) => {
	try {
		const config = await app.vault.adapter.read(
			normalizePath(app.vault.configDir + "/app.json")
		);
		if (config) {
			const json: Record<string, any> = JSON.parse(config);
			if (json[key]) return json[key];
		}
	} catch (err) {
		console.log("Cannot find app.json file");
	}
	return null;
};
