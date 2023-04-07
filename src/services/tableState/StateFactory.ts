import { randomUUID } from "crypto";
import { randomColor } from "../random";
import {
	Cell,
	CellType,
	Column,
	Row,
	Tag,
	SortDir,
	CurrencyType,
} from "./types";

export default class StateFactory {
	static createColumn(): Column {
		return {
			id: randomUUID(),
			sortDir: SortDir.NONE,
			width: "140px",
			type: CellType.TEXT,
			currencyType: CurrencyType.UNITED_STATES,
			hasAutoWidth: false,
			shouldWrapOverflow: true,
			footerCellId: randomUUID(),
		};
	}

	static createRow(): Row {
		const currentTime = Date.now();
		return {
			id: randomUUID(),
			menuCellId: randomUUID(),
			creationTime: currentTime,
			lastEditedTime: currentTime,
		};
	}

	static createCell(
		columnId: string,
		rowId: string,
		isHeader: boolean
	): Cell {
		return {
			id: randomUUID(),
			columnId,
			rowId,
			markdown: isHeader ? "New Column" : "",
			isHeader,
		};
	}

	static createTag(
		columnId: string,
		cellId: string,
		markdown: string,
		color = randomColor()
	): Tag {
		return {
			id: randomUUID(),
			columnId,
			markdown: markdown,
			color,
			cellIds: [cellId],
		};
	}
}
