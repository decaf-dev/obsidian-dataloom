import { AppData } from "../state/appData";

export const updateAppDataFromSavedState = (
	oldData: AppData,
	newData: AppData
): AppData => {
	const updated = { ...newData };

	//Grab sort and width settings
	newData.headers.forEach((header, i) => {
		const oldHeader = oldData.headers.find((h) => h.id === header.id);
		if (oldHeader) {
			const { sortName, width } = oldHeader;
			updated.headers[i].sortName = sortName;
			updated.headers[i].width = width;
		}
	});

	//Grab creation times
	newData.rows.forEach((row, i) => {
		const oldRow = oldData.rows.find((row) => row.id === row.id);
		if (oldRow) {
			const { creationTime } = oldRow;
			updated.rows[i].creationTime = creationTime;
		}
	});

	newData.tags.forEach((tag, i) => {
		const oldTag = oldData.tags.find(
			(t) => t.headerId === tag.headerId && t.content === tag.content
		);
		if (oldTag) {
			const { color } = oldTag;
			updated.tags[i].color = color;
		}
	});
	return updated;
};
