import { CONTENT_TYPE } from "src/constants";

import { Cell } from "./types";

export class BaseCell implements Cell {
	id: string;
	rowId: string;
	headerId: string;
	type: string;

	constructor(id: string, rowId: string, headerId: string, type?: string) {
		this.id = id;
		this.rowId = rowId;
		this.headerId = headerId;
		this.type = type;
	}

	toString(): string {
		return "";
	}

	length(): number {
		return 0;
	}
}

export class TextCell extends BaseCell {
	text: string;

	constructor(id: string, rowId: string, headerId: string, text = "") {
		super(id, rowId, headerId, CONTENT_TYPE.TEXT);
		this.text = text;
	}

	length() {
		return this.text.length;
	}

	toString() {
		return this.text;
	}
}

export class NumberCell extends BaseCell {
	number: string;

	constructor(id: string, rowId: string, headerId: string, number: string) {
		super(id, rowId, headerId, CONTENT_TYPE.NUMBER);
		this.number = number;
	}

	length() {
		return this.number.length;
	}

	toString() {
		return this.number;
	}
}

export class TagCell extends BaseCell {
	constructor(id: string, rowId: string, headerId: string) {
		super(id, rowId, headerId, CONTENT_TYPE.TAG);
	}
}

export class CheckBoxCell extends BaseCell {
	isChecked: boolean;

	constructor(
		id: string,
		rowId: string,
		headerId: string,
		isChecked = false
	) {
		super(id, rowId, headerId, CONTENT_TYPE.CHECKBOX);
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

export class DateCell extends BaseCell {
	date: Date | null;

	constructor(id: string, rowId: string, headerId: string, date: Date) {
		super(id, rowId, headerId, CONTENT_TYPE.DATE);
		this.date = date;
	}

	length() {
		if (this.date !== null) {
			return "YYYY/MM/DD".length;
		} else {
			return 0;
		}
	}

	toString() {
		if (this.date !== null) {
			const day = ("0" + this.date.getDate()).slice(-2);
			const month = ("0" + (this.date.getMonth() + 1)).slice(-2);
			const year = this.date.getFullYear();
			return `${year}/${month}/${day}`;
		} else {
			return "";
		}
	}
}
