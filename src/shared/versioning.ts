export const legacyVersionToString = (version: number) => {
	return version.toString().split("").join(".");
};

export const isVersionLessThan = (oldVersion: string, newVersion: string) => {
	const oldVersionArray = oldVersion.split(".");
	const newVersionArray = newVersion.split(".");

	for (let i = 0; i < oldVersionArray.length; i++) {
		const oldVersionNumber = parseInt(oldVersionArray[i]);
		const newVersionNumber = parseInt(newVersionArray[i]);

		if (oldVersionNumber < newVersionNumber) {
			return true;
		}

		if (oldVersionNumber > newVersionNumber) {
			return false;
		}
	}

	return false;
};
