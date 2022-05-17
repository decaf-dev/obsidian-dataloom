import { CELL_TYPE } from "src/app/constants";

export class Cell {
	id: string;
	rowId: string;
	headerId: string;
	type: string;
	expectedType: string | null;
	constructor(
		id: string,
		rowId: string,
		headerId: string,
		type: string,
		expectedType: string | null
	) {
		this.id = id;
		this.rowId = rowId;
		this.headerId = headerId;
		this.type = type;
		this.expectedType = expectedType;
	}

	toString(): string {
		return "";
	}

	length(): number {
		return 0;
	}
}

export class ErrorCell extends Cell {
	content: any;

	constructor(
		id: string,
		rowId: string,
		headerId: string,
		expectedType: string,
		content: any
	) {
		super(id, rowId, headerId, CELL_TYPE.ERROR, expectedType);
		this.content = content;
	}

	toString() {
		return this.content;
	}
}

export class TextCell extends Cell {
	text: string;

	constructor(id: string, rowId: string, headerId: string, text = "") {
		super(id, rowId, headerId, CELL_TYPE.TEXT, null);
		this.text = text;
	}

	length() {
		return this.text.length;
	}

	toString() {
		return this.text;
	}
}

export class NumberCell extends Cell {
	number: number;

	constructor(id: string, rowId: string, headerId: string, number = -1) {
		super(id, rowId, headerId, CELL_TYPE.NUMBER, null);
		this.number = number;
	}

	length() {
		if (this.number === -1) return 0;
		return this.number.toString().length;
	}

	toString() {
		if (this.number === -1) return "";
		return this.number.toString();
	}
}

export class TagCell extends Cell {
	constructor(id: string, rowId: string, headerId: string) {
		super(id, rowId, headerId, CELL_TYPE.TAG, null);
	}
}

export class CheckBoxCell extends Cell {
	isChecked: boolean;

	constructor(
		id: string,
		rowId: string,
		headerId: string,
		isChecked = false
	) {
		super(id, rowId, headerId, CELL_TYPE.CHECKBOX, null);
		this.isChecked = isChecked;
	}

	length() {
		if (this.isChecked) {
			return "[x]".length;
		} else {
			return "[ ]".length;
		}
	}

	toString() {
		if (this.isChecked) {
			return "[x]";
		} else {
			return "[ ]";
		}
	}
}

export class DateCell extends Cell {
	date: Date;

	constructor(
		id: string,
		rowId: string,
		headerId: string,
		date: Date = null
	) {
		super(id, rowId, headerId, CELL_TYPE.DATE, null);
		this.date = date;
	}

	length() {
		if (this.date === null) return 0;
		return "MM/DD/YY".length;
	}

	toString() {
		if (this.date === null) return "";
		const day = ("0" + this.date.getDate()).slice(-2);
		const month = ("0" + (this.date.getMonth() + 1)).slice(-2);
		const year = this.date.getFullYear();
		return `${month}/${day}/${year}`;
	}
}

export const initialCell = (
	id: string,
	rowId: string,
	headerId: string,
	type: string,
	content: any = undefined
) => {
	switch (type) {
		case CELL_TYPE.TEXT:
			return new TextCell(id, rowId, headerId, content);
		case CELL_TYPE.NUMBER:
			return new NumberCell(id, rowId, headerId, content);
		case CELL_TYPE.TAG:
			return new TagCell(id, rowId, headerId);
		case CELL_TYPE.CHECKBOX:
			return new CheckBoxCell(id, rowId, headerId, content);
		case CELL_TYPE.DATE:
			return new DateCell(id, rowId, headerId, content);
	}
};
