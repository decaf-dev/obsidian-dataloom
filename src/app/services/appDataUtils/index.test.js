import { findNextTabbableElement, findTabbableElementMatrix } from "./index";
import { findAppData } from "../utils";
import { TABBABLE_ELEMENT_TYPE } from "../../constants";

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
			{ [data.headers[0].id]: TABBABLE_ELEMENT_TYPE.HEADER },
			{ [data.headers[1].id]: TABBABLE_ELEMENT_TYPE.HEADER },
			{ "button-0": TABBABLE_ELEMENT_TYPE.BUTTON },
			{ [data.cells[0].id]: TABBABLE_ELEMENT_TYPE.CELL },
			{ [data.cells[1].id]: TABBABLE_ELEMENT_TYPE.CELL },
			{ "button-1": TABBABLE_ELEMENT_TYPE.BUTTON },
			{ "button-2": TABBABLE_ELEMENT_TYPE.BUTTON },
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
			[data.cells[1].id]: TABBABLE_ELEMENT_TYPE.CELL,
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
		const found = findNextTabbableElement(data, "button-2");
		expect(found).toEqual({
			[data.headers[0].id]: TABBABLE_ELEMENT_TYPE.HEADER,
		});
	});
});
