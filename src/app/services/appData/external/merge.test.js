import { findAppData } from "./saveUtils";
import { updateAppDataFromSavedState } from "./merge";
import { CELL_TYPE } from "src/app/constants";
import { SORT } from "src/app/components/HeaderMenu/constants";

describe("updateAppDataFromSavedState", () => {
	it("merges new header content", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
		]);
		const newAppData = findAppData([
			["Column 1 Updated", "Column 2 Updated", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
		]);

		const merged = updateAppDataFromSavedState(oldAppData, newAppData);
		//Check content
		expect(merged.headers[0].content).toEqual("Column 1 Updated");
		expect(merged.headers[1].content).toEqual("Column 2 Updated");
	});

	it("merges new cell content", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1", "Cell 2", "row-id-123456"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1 Updated", "Cell 2 Updated", "row-id-123456"],
		]);

		const merged = updateAppDataFromSavedState(oldAppData, newAppData);
		//Check content
		expect(merged.cells[0].content).toEqual("Cell 1 Updated");
		expect(merged.cells[1].content).toEqual("Cell 2 Updated");
	});

	it("merges updated column type", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1", "Cell 2", "row-id-123456"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2", ""],
			["number", "tag", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["123456", "#tag", "row-id-123456"],
		]);

		const merged = updateAppDataFromSavedState(oldAppData, newAppData);
		expect(merged.headers[0].type).toEqual(CELL_TYPE.NUMBER);
		expect(merged.headers[1].type).toEqual(CELL_TYPE.TAG);
	});

	it("merges new tag content", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2", ""],
			["tag", "tag", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["#tag1", "#tag2", "row-id-123456"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2", ""],
			["tag", "tag", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["#tag1-updated", "#tag2", "row-id-123456"],
		]);

		const merged = updateAppDataFromSavedState(oldAppData, newAppData);
		expect(merged.tags[0].color).toEqual(newAppData.tags[0].color);
		expect(merged.tags[1].color).toEqual(oldAppData.tags[1].color);
		expect(merged.tags[0].content).toEqual("tag1-updated");
		expect(merged.tags[1].content).toEqual("tag2");
	});

	it("merges header sort name", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1", "Cell 2", "row-id-123456"],
		]);
		oldAppData.headers[0].sortName = SORT.ASC.name;
		oldAppData.headers[1].sortName = SORT.DESC.name;
		const newAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1 Updated", "Cell 2 Updated", "row-id-123456"],
		]);

		const merged = updateAppDataFromSavedState(oldAppData, newAppData);
		expect(merged.headers[0].sortName).toEqual(SORT.ASC.name);
		expect(merged.headers[1].sortName).toEqual(SORT.DESC.name);
	});

	it("merges header width", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1", "Cell 2", "row-id-123456"],
		]);
		oldAppData.headers[0].width = "20rem";
		oldAppData.headers[1].width = "15rem";
		const newAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1 Updated", "Cell 2 Updated", "row-id-123456"],
		]);

		const merged = updateAppDataFromSavedState(oldAppData, newAppData);
		expect(merged.headers[0].width).toEqual("20rem");
		expect(merged.headers[1].width).toEqual("15rem");
	});

	it("merges row creation times", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1", "Cell 2", "row-id-123456"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2", ""],
			["text", "text", ""],
			["column-id-123456", "column-id-234567", "table-id-123456"],
			["Cell 1 Updated", "Cell 2 Updated", "row-id-123456"],
		]);

		const merged = updateAppDataFromSavedState(oldAppData, newAppData);
		expect(merged.rows[0].creationTime).toEqual(
			oldAppData.rows[0].creationTime
		);
	});
});
