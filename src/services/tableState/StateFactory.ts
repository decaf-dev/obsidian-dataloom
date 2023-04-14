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
	DateFormat,
} from "./types";

export default class StateFactory {
	static createColumn(): Column {
		return {
			id: randomUUID(),
			sortDir: SortDir.NONE,
			isVisible: true,
			width: "140px",
			type: CellType.TEXT,
			currencyType: CurrencyType.UNITED_STATES,
			dateFormat: DateFormat.MM_DD_YYYY,
			shouldWrapOverflow: false,
			footerCellId: randomUUID(),
		};
	}

	static createRow(totalRowCount: number): Row {
		const currentTime = Date.now();
		return {
			id: randomUUID(),
			index: totalRowCount,
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
			dateTime: null,
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
