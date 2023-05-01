import { EXTENSION_REGEX } from "./constants";

export const splitFileExtension = (
	filePath: string
): [string, string] | null => {
	if (filePath.match(EXTENSION_REGEX)) {
		const periodIndex = filePath.lastIndexOf(".");
		return [
			filePath.substring(0, periodIndex),
			filePath.substring(periodIndex),
		];
	}
	return null;
};
