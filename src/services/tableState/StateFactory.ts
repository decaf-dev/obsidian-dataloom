import { randomUUID } from "crypto";
import { randomColor } from "../random";
import { SortDir } from "../sort/types";
import { Cell, CellType, Column, Row, Tag } from "./types";

export default class StateFactory {
	static createColumn(): Column {
		return {
			id: randomUUID(),
			sortDir: SortDir.NONE,
			width: "120px",
			type: CellType.TEXT,
			useAutoWidth: false,
			shouldWrapOverflow: false,
			tags: [],
			footerCellId: randomUUID(),
		};
	}

	static createRow(): Row {
		return {
			id: randomUUID(),
			menuCellId: randomUUID(),
			creationDate: Date.now(),
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
