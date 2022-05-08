import { AppData } from "../state/appData";
import { AppDataStringBuffer } from "../external/saveUtils";
import { CELL_TYPE } from "src/app/constants";

export const printDataIds = (tableId: string, data: AppData): string => {
	const COLUMN_SIZE = 40;
	const buffer = new AppDataStringBuffer();
	buffer.createRow();

	data.headers.forEach((header, i) =>
		buffer.writeColumn(header.id, COLUMN_SIZE)
	);

	buffer.createRow();

	data.headers.forEach((_header, i) => {
		const content = Array(COLUMN_SIZE).fill("-").join("");
		buffer.writeColumn(content, COLUMN_SIZE);
	});

	buffer.createRow();

	data.headers.forEach((_header, i) => {
		buffer.writeColumn(i === 0 ? tableId : "", COLUMN_SIZE);
	});

	buffer.createRow();

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.type, COLUMN_SIZE);
	});

	data.rows.forEach((row) => {
		buffer.createRow();

		for (let i = 0; i < data.headers.length; i++) {
			const cell = data.cells.find(
				(cell) =>
					cell.rowId === row.id &&
					cell.headerId === data.headers[i].id
			);
			if (cell.type === CELL_TYPE.TAG) {
				const tag = data.tags.find((tag) =>
					tag.selected.includes(cell.id)
				);
				if (tag) {
					buffer.writeColumn(tag.id, COLUMN_SIZE);
				} else {
					buffer.writeColumn("", COLUMN_SIZE);
				}
			} else {
				buffer.writeColumn(cell.id, COLUMN_SIZE);
			}
		}
	});
	return buffer.toString();
};
