import { App } from "obsidian";
import { ObsidianPropertyType } from "./types";
import { getAllObsidianProperties } from "./obsidian-utils";

export default class FrontmatterCache {
	static instance: FrontmatterCache;

	private cache: Map<string, ObsidianPropertyType> = new Map<
		string,
		ObsidianPropertyType
	>();

	loadProperties(app: App) {
		// console.log("Loading frontmatter properties...");
		this.cache.clear();

		const properties = getAllObsidianProperties(app);
		Object.values(properties).forEach((value) => {
			const { name, type } = value as {
				name: string;
				type: ObsidianPropertyType;
			};
			this.cache.set(name, type ?? ObsidianPropertyType.TEXT);
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

	setPropertyType(name: string, type: ObsidianPropertyType) {
		this.cache.set(name, type);
	}

	getCache() {
		return this.cache;
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new FrontmatterCache();
		}
		return this.instance;
	}
}
