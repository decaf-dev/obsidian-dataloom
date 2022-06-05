import { Tag } from "@mui/icons-material";
import { AppData } from "../state/appData";

export const updateAppDataFromSavedState = (
	oldData: AppData,
	newData: AppData
): AppData => {
	const updated = { ...newData };

	//Grab sort and width settings
	newData.headers.forEach((_header, i) => {
		if (i < oldData.headers.length) {
			const { sortName, width } = oldData.headers[i];
			updated.headers[i].sortName = sortName;
			updated.headers[i].width = width;
		}
	});

	//Grab creation times
	newData.rows.forEach((_row, i) => {
		if (i < oldData.headers.length) {
			const { creationTime } = oldData.rows[i];
			updated.rows[i].creationTime = creationTime;
		}
	});

	newData.tags.forEach((tag, i) => {
		if (i < oldData.tags.length) {
			if (oldData.tags[i].content === tag.content) {
				const { color } = oldData.tags[i];
				updated.tags[i].color = color;
			}
		}
	});
	return updated;
};
