import { v4 as uuid } from "uuid";

import { initialTag } from "../state/tag";
import { AppData } from "../state/appData";
import { updateCell } from "./loadUtils";
import { randomColor } from "../../random";

import { CELL_TYPE } from "src/app/constants";

export const updateAppDataFromSavedState = (
	oldData: AppData,
	newData: AppData
): AppData => {
	const updated = { ...newData };

	//Grab sort and width settings
	newData.headers.forEach((_header, i) => {
		if (i < oldData.headers.length) {
			const { sortName, width, type } = oldData.headers[i];
			updated.headers[i].sortName = sortName;
			updated.headers[i].width = width;
			updated.headers[i].type = type;
		}
	});

	newData.cells.forEach((c, i) => {
		const content = c.toString();
		const { id, rowId, headerId } = c;
		const header = newData.headers.find((header) => header.id === headerId);
		const cell = updateCell(id, rowId, headerId, header.type, content);
		updated.cells[i] = cell;

		if (cell.type === CELL_TYPE.TAG) {
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

	//Grab creation times
	newData.rows.forEach((_row, i) => {
		if (i < oldData.headers.length) {
			const { creationTime } = oldData.rows[i];
			updated.rows[i].creationTime = creationTime;
		}
	});

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
