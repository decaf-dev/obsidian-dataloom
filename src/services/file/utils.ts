export const EXTENSION_REGEX = new RegExp("\\.[a-z]*$");

export const getFilePathExtension = (filePath: string) => {
	if (filePath.match(EXTENSION_REGEX)) {
		const periodIndex = filePath.lastIndexOf(".");
		return {
			pathWithoutExtension: filePath.substring(0, periodIndex),
			extension: filePath.substring(periodIndex),
		};
	}
	return null;
};
