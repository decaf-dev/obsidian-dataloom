export class VaultFile {
	extension: string;
	basename: string;
	path: string;
	name: string;
	modifiedTime: number;
	parent: {
		path: string;
	} | null;
}

export const getVaultFiles = (): VaultFile[] => {
	return [];
};
