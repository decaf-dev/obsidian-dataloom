import { AppData } from "../state/appData";
import { AppDataStringBuffer } from "../external/saveUtils";
import { calcColumnCharLengths } from "../external/saveUtils";
import { CONTENT_TYPE } from "src/app/constants";

export const logFunc = (
	componentName: string,
	functionName: string,
	args = {}
) => {
	console.log(
		`[${componentName}]: ${functionName}(${Object.keys(args).join(", ")})`
	);
	if (Object.keys(args).length !== 0) console.log(args);
};

export const appDataIdsToMarkdown = (data: AppData): string => {
	const columnCharLengths = calcColumnCharLengths(data);

	const buffer = new AppDataStringBuffer();
	buffer.createRow();

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.content, columnCharLengths[i]);
	});

	buffer.createRow();

	for (let i = 0; i < data.headers.length + 1; i++) {
		const content = Array(columnCharLengths[i]).fill("-").join("");
		buffer.writeColumn(content, columnCharLengths[i]);
	}

	data.rows.forEach((row) => {
		buffer.createRow();

		for (let i = 0; i < data.headers.length; i++) {
			const cell = data.cells.find(
				(cell) =>
					cell.rowId === row.id &&
					cell.headerId === data.headers[i].id
			);
			if (cell.type === CONTENT_TYPE.TAG) {
				const tagIds = data.tags
					.filter((tag) => tag.selected.includes(cell.id))
					.map((tag) => tag.id);
				buffer.writeColumn(tagIds.join(", "), columnCharLengths[i]);
			} else {
				buffer.writeColumn(cell.id, columnCharLengths[i]);
			}
		}
	});
	return buffer.toString();
};

export const appDataTypesToMarkdown = (data: AppData): string => {
	const columnCharLengths = calcColumnCharLengths(data);

	const buffer = new AppDataStringBuffer();
	buffer.createRow();

	data.headers.forEach((header, i) => {
		buffer.writeColumn(header.content, columnCharLengths[i]);
	});

	buffer.createRow();

	for (let i = 0; i < data.headers.length; i++) {
		const content = Array(columnCharLengths[i]).fill("-").join("");
		buffer.writeColumn(content, columnCharLengths[i]);
	}

	data.rows.forEach((row) => {
		buffer.createRow();

		for (let i = 0; i < data.headers.length; i++) {
			const cell = data.cells.find(
				(cell) =>
					cell.rowId === row.id &&
					cell.headerId === data.headers[i].id
			);
			buffer.writeColumn(cell.type, columnCharLengths[i]);
		}
	});
	return buffer.toString();
};
