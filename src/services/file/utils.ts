export const getFilePathExtension = (filePath: string) => {
	const extensionRegex = new RegExp("\\.[a-z]*$");
	if (filePath.match(extensionRegex)) {
		const periodIndex = filePath.lastIndexOf(".");
		return {
			pathWithoutExtension: filePath.substring(0, periodIndex),
			extension: filePath.substring(periodIndex),
		};
	}
	return null;
};
