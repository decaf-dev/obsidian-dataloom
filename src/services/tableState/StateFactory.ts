import { randomUUID } from "crypto";
import { randomColor } from "../random";
import { Cell, CellType, Column, Row, Tag, SortDir } from "./types";

export default class StateFactory {
	static createColumn(): Column {
		return {
			id: randomUUID(),
			sortDir: SortDir.NONE,
			width: "140px",
			type: CellType.TEXT,
			useAutoWidth: false,
			shouldWrapOverflow: false,
			tags: [],
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
		cellId: string,
		markdown: string,
		color = randomColor()
	): Tag {
		return {
			id: randomUUID(),
			markdown: markdown,
			color,
			cells: [cellId],
		};
	}
}
