import { randomUUID } from "crypto";
import { markdownToHtml } from "../io/deserialize";
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
		};
	}

	static createRow(): Row {
		return {
			id: randomUUID(),
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
			markdown: "",
			html: "",
			isHeader,
		};
	}

	static createTag(cell: Cell, markdown: string): Tag {
		return {
			id: randomUUID(),
			markdown: markdown,
			html: markdownToHtml(markdown),
			color: randomColor(),
			cells: [cell.id],
		};
	}
}
