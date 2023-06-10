import { TFile } from "obsidian";

export type VaultFile = TFile;

export const getVaultFiles = (): VaultFile[] => {
	return app.vault.getFiles();
};
