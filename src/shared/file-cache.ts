import { App, Notice, TFile } from "obsidian";

export interface FileCacheData {
	frontmatter: Record<string, unknown>;
}

export default class FileCache {
	private app: App;

	private cache: Map<string, FileCacheData> = new Map();
	private static instance: FileCache | null = null;

	private constructor(app: App) {
		this.app = app;
	}

	static getInstance(app?: App): FileCache {
		if (!FileCache.instance) {
			if (!app) throw new Error("App is required to create FileCache.");
			FileCache.instance = new FileCache(app);
		}
		return FileCache.instance;
	}

	async load() {
		new Notice("Loading DataLoom cache...");
		const files = this.app.vault.getFiles();
		for (const file of files) {
			await this.app.fileManager.processFrontMatter(
				file,
				(frontmatter) => {
					this.cache.set(file.path, { frontmatter });
				}
			);
		}
		new Notice(`DataLoom loaded ${files.length} files.`);
	}

	onFileRename(prevFilePath: string, newFilePath: string) {
		const data = this.cache.get(prevFilePath);
		if (data) {
			this.cache.delete(prevFilePath);
			this.cache.set(newFilePath, data);
		}
	}

	async onFileCreate(file: TFile) {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			this.cache.set(file.path, { frontmatter });
		});
	}

	onDeleteFile(filePath: string) {
		this.cache.delete(filePath);
	}

	getFrontMatter(filePath: string, key: string) {
		const data = this.cache.get(filePath);
		if (data) {
			if (key in data.frontmatter) {
				return data.frontmatter[key];
			}
		}
		return null;
	}
}
