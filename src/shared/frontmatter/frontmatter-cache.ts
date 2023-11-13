import { App } from "obsidian";
import { ObsidianPropertyType } from "./types";
import { getAllObsidianProperties } from "./obsidian-utils";

export default class FrontmatterCache {
	static instance: FrontmatterCache;

	private cache: Map<string, ObsidianPropertyType> = new Map<
		string,
		ObsidianPropertyType
	>();

	async loadProperties(app: App) {
		// console.log("Loading frontmatter properties...");
		this.cache.clear();

		const properties = await getAllObsidianProperties(app);

		Object.values(properties).forEach((value) => {
			const { name, type } = value as {
				name: string;
				type: ObsidianPropertyType;
			};
			this.cache.set(name, type);
		});
	}

	getPropertyNames(type: ObsidianPropertyType) {
		return [...this.cache.entries()]
			.filter(([, propertyType]) => propertyType === type)
			.map(([name]) => name);
	}

	getPropertyType(name: string) {
		return this.cache.get(name);
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new FrontmatterCache();
		}
		return this.instance;
	}
}
