import { v4 as uuidv4 } from "uuid";
import { randomColor } from "../random";
import {
	HeaderCell,
	BodyCell,
	FooterCell,
	CellType,
	Column,
	BodyRow,
	Tag,
	SortDir,
	CurrencyType,
	DateFormat,
	GeneralFunction,
	HeaderRow,
	FooterRow,
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
		};
	}

	static createHeaderRow(): HeaderRow {
		return {
			id: uuidv4(),
		};
	}

	static createFooterRow(): FooterRow {
		return {
			id: uuidv4(),
		};
	}

	static createBodyRow(currentBodyRowCount: number): BodyRow {
		const currentTime = Date.now();
		return {
			id: uuidv4(),
			index: currentBodyRowCount,
			menuCellId: uuidv4(),
			creationTime: currentTime,
			lastEditedTime: currentTime,
		};
	}

	static createHeaderCell(columnId: string, rowId: string): HeaderCell {
		return {
			id: uuidv4(),
			columnId,
			rowId,
			markdown: "New Column",
		};
	}

	static createBodyCell(columnId: string, rowId: string): BodyCell {
		return {
			id: uuidv4(),
			columnId,
			rowId,
			dateTime: null,
			markdown: "",
		};
	}

	static createFooterCell(columnId: string, rowId: string): FooterCell {
		return {
			id: uuidv4(),
			columnId,
			rowId,
			functionType: GeneralFunction.NONE,
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
