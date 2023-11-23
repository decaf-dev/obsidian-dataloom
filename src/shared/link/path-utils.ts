export const getFileNameFromPath = (path: string): string => {
	const split = path.split("/");
	if (split.length === 0) return "";

	const fileName = split[split.length - 1];

	// Check if there's a period in the file name
	if (fileName.includes(".")) {
		// Return the file name without the extension
		return fileName.substring(0, fileName.lastIndexOf("."));
	}

	return fileName;
};
