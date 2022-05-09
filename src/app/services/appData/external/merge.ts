import { AppData } from "../state/appData";
import { AppSaveState } from "../state/appSaveState";

export const updateAppDataFromSavedState = (
	saveState: AppSaveState,
	data: AppData
): AppData => {
	const updated = { ...data };

	//Grab sort and width settings
	data.headers.forEach((header, i) => {
		if (saveState.headers[header.id]) {
			const { sortName, width } = saveState.headers[header.id];
			updated.headers[i].sortName = sortName;
			updated.headers[i].width = width;
		}
	});

	//Grab creation times
	data.rows.forEach((row, i) => {
		if (saveState.rows[row.id]) {
			const { creationTime } = saveState.rows[row.id];
			updated.rows[i].creationTime = creationTime;
		}
	});

	data.tags.forEach((tag, i) => {
		if (saveState.headers[tag.headerId]) {
			if (saveState.headers[tag.headerId].tags[tag.content]) {
				const { color } =
					saveState.headers[tag.headerId].tags[tag.content];
				updated.tags[i].color = color;
			}
		}
	});
	return updated;
};
