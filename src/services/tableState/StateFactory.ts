import { v4 as uuidv4 } from "uuid";
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
			id: uuidv4(),
			sortDir: SortDir.NONE,
			isVisible: true,
			width: "140px",
			type: CellType.TEXT,
			currencyType: CurrencyType.UNITED_STATES,
			dateFormat: DateFormat.MM_DD_YYYY,
			shouldWrapOverflow: false,
			footerCellId: uuidv4(),
		};
	}

	static createRow(totalRowCount: number): Row {
		const currentTime = Date.now();
		return {
			id: uuidv4(),
			index: totalRowCount,
			menuCellId: uuidv4(),
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
			id: uuidv4(),
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
			id: uuidv4(),
			columnId,
			markdown: markdown,
			color,
			cellIds: [cellId],
		};
	}
}
