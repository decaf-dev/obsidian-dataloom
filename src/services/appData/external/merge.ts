import { v4 as uuid } from "uuid";

import { initialTag } from "../state/initialState";
import { AppData } from "../state/types";
import { randomColor } from "../../random";
import { initialCell } from "../state/initialState";

import { CellType } from "src/services/appData/state/types";

export const updateAppDataFromSavedState = (
	oldData: AppData,
	newData: AppData
): AppData => {
	const updated = { ...newData };

	//Grab sort and width settings
	newData.headers.forEach((_header, i) => {
		if (i < oldData.headers.length) {
			const { sortDir, width, type, shouldWrapOverflow, useAutoWidth } =
				oldData.headers[i];
			updated.headers[i].sortDir = sortDir;
			updated.headers[i].width = width;
			updated.headers[i].type = type;
			updated.headers[i].shouldWrapOverflow = shouldWrapOverflow;
			updated.headers[i].useAutoWidth = useAutoWidth;
		}
	});

	newData.cells.forEach((c, i) => {
		const { id, rowId, headerId, content } = c;
		const header = newData.headers.find((header) => header.id === headerId);
		const cell = initialCell(id, headerId, rowId, header.type, content, "");
		updated.cells[i] = cell;

		if (cell.type === CellType.TAG) {
			//Check if tag already exists, otherwise create a new
			const index = updated.tags.findIndex(
				(tag) => tag.content === content
			);
			if (index !== -1) {
				updated.tags[index].selected.push(id);
			} else {
				updated.tags.push(
					initialTag(uuid(), headerId, id, content, randomColor())
				);
			}
		}
	});

	newData.rows.forEach((_row, i) => {
		if (i < oldData.rows.length) {
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
