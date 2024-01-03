export default class LastSavedManager {
	private static instance: LastSavedManager;
	private lastSavedFile: string = "";
	private lastSavedTime: number = 0;


	// Ensures only one instance is created
	public static getInstance(): LastSavedManager {
		if (!LastSavedManager.instance) {
			LastSavedManager.instance = new LastSavedManager();
		}
		return LastSavedManager.instance;
	}

	public setLastSavedFile(fileName: string): void {
		this.lastSavedFile = fileName;
		this.lastSavedTime = Date.now();
	}

	public getLastSavedFile(): string {
		return this.lastSavedFile;
	}

	public getLastSavedTime(): number {
		return this.lastSavedTime;
	}

	public clearLastSavedFile(): void {
		this.lastSavedFile = "";
	}


}
