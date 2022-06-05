import { findTabbableElementMatrix, findNextTabbableElement } from "./tabbable";
import { findAppData } from "../external/saveUtils";
import { TABBABLE_ELEMENT_TYPE } from "src/app/constants";

describe("findTabbableElementMatrix", () => {
	it("finds a correct matrx", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
		];
		const data = findAppData(parsedTable);
		const matrix = findTabbableElementMatrix(data);
		expect(matrix).toEqual([
			{ id: data.cells[0].id, type: TABBABLE_ELEMENT_TYPE.CELL },
			{ id: data.cells[1].id, type: TABBABLE_ELEMENT_TYPE.CELL },
		]);
	});
});

describe("findNextTabbableElement", () => {
	it("finds next element", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["Cell 1", "Cell 2"],
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
			["Cell 1", "Cell 2"],
		];
		const data = findAppData(parsedTable);
		const found = findNextTabbableElement(data, data.cells[1].id);
		expect(found).toEqual({
			id: data.cells[0].id,
			type: TABBABLE_ELEMENT_TYPE.CELL,
		});
	});
});
