import { App, Notice, TFile } from "obsidian";

export interface FileCacheData {
	frontmatter: Record<string, unknown>;
}

export default class FileCache {
	private app: App;
	private hasLoaded: boolean;

	private cache: Map<string, FileCacheData> = new Map();
	private static instance: FileCache | null = null;

	private constructor(app: App) {
		this.app = app;
		this.hasLoaded = false;
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
			await this.loadFrontMatter(file);
		}
		new Notice(`DataLoom loaded ${files.length} files.`);
		this.hasLoaded = true;
	}

	onFileRename(file: TFile, oldPath: string) {
		if (!this.hasLoaded) return;

		const { path } = file;

		const data = this.cache.get(oldPath);
		if (data) {
			this.cache.delete(oldPath);
			this.cache.set(path, data);
		}
	}

	async onFileCreate(file: TFile) {
		if (!this.hasLoaded) return;

		await this.loadFrontMatter(file);
	}

	onDeleteFile(file: TFile) {
		if (!this.hasLoaded) return;

		const { path } = file;

		this.cache.delete(path);
	}

	async onFileModify(file: TFile) {
		if (!this.hasLoaded) return;

		await this.loadFrontMatter(file);
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

	hasLoadedCache() {
		return this.hasLoaded;
	}

	private async loadFrontMatter(file: TFile) {
		await this.app.fileManager.processFrontMatter(file, (frontmatter) => {
			this.cache.set(file.path, { frontmatter });
		});
	}
}
