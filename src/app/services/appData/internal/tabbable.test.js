import { findTabbableElementMatrix, findNextTabbableElement } from "./tabbable";
import { findAppData } from "../external/saveUtils";
import { TABBABLE_ELEMENT_TYPE } from "src/app/constants";

describe("findTabbableElementMatrix", () => {
	it("finds a correct matrx", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["12345", ""],
			["text", "text"],
			["test", "test"],
		];
		const data = findAppData(parsedTable);
		const matrix = findTabbableElementMatrix(data);
		expect(matrix).toEqual([
			// { id: data.headers[0].id, type: TABBABLE_ELEMENT_TYPE.HEADER },
			// { id: data.headers[1].id, type: TABBABLE_ELEMENT_TYPE.HEADER },
			// { id: "button-0", type: TABBABLE_ELEMENT_TYPE.BUTTON },
			{ id: data.cells[0].id, type: TABBABLE_ELEMENT_TYPE.CELL },
			{ id: data.cells[1].id, type: TABBABLE_ELEMENT_TYPE.CELL },
			// { id: "button-1", type: TABBABLE_ELEMENT_TYPE.BUTTON },
			// { id: "button-2", type: TABBABLE_ELEMENT_TYPE.BUTTON },
		]);
	});
});

describe("findNextTabbableElement", () => {
	it("finds next element", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["12345", ""],
			["text", "text"],
			["test", "test"],
		];
		const data = findAppData(parsedTable);
		const found = findNextTabbableElement(data, data.cells[0].id);
		expect(found).toEqual({
			id: data.cells[1].id,
			type: TABBABLE_ELEMENT_TYPE.CELL,
		});
	});
	it("finds loops element at end", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["12345", ""],
			["text", "text"],
			["test", "test"],
		];
		const data = findAppData(parsedTable);
		const found = findNextTabbableElement(data, data.cells[1].id);
		expect(found).toEqual({
			id: data.cells[0].id,
			type: TABBABLE_ELEMENT_TYPE.CELL,
		});
	});
});
