import { findAppData } from "./saveUtils";
import { mergeAppData } from "./merge";
import { CELL_TYPE } from "src/app/constants";

describe("mergeAppData", () => {
	it("merges new header content", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["test 1", "test 2"],
		]);
		const newAppData = findAppData([
			["Column 3", "Column 4"],
			["123456", ""],
			["text", "text"],
			["test 1", "test 2"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		//Check content
		expect(merged.headers[0].content).toEqual("Column 3");
		expect(merged.headers[1].content).toEqual("Column 4");
	});

	it("merges new cell content", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["test 1", "test 2"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["updated 1", "updated 2"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		//Check content
		expect(merged.cells[0].content).toEqual("updated 1");
		expect(merged.cells[1].content).toEqual("updated 2");
	});

	it("merges updated column type", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["test 1", "test 2"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["number", "tag"],
			["25", "#test"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		expect(merged.headers[0].type).toEqual(CELL_TYPE.NUMBER);
		expect(merged.headers[1].type).toEqual(CELL_TYPE.TAG);
		expect(merged.cells[0].content).toEqual("25");
		expect(merged.tags[0].content).toEqual("test");
		expect(merged.tags[0].color).toEqual(newAppData.tags[0].color);
	});

	it("merges new tag content", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["tag", "tag"],
			["#tag1", "#tag2"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["tag", "tag"],
			["#tag2", "#tag3"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		expect(merged.tags[0].color).toEqual(oldAppData.tags[1].color);
		expect(merged.tags[1].color).toEqual(newAppData.tags[1].color);
		expect(merged.tags[0].content).toEqual("tag2");
		expect(merged.tags[1].content).toEqual("tag3");
	});

	//TODO
	// it("merges header sort name", () => {

	// });

	//TODO
	// it("merges header width", () => {

	// });

	it("merges row creation times", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["test 1", "test 2"],
			["test 3", "test 4"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["updated 1", "test 2"],
			["test 3", "updated 4"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		expect(merged.rows[0].creationTime).toEqual(
			oldAppData.rows[0].creationTime
		);
		expect(merged.rows[1].creationTime).toEqual(
			newAppData.rows[1].creationTime
		);
	});

	it("merges table with row removed from bottom", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["test 1", "test 2"],
			["test 3", "test 4"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["test 3", "test 4"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		expect(merged.rows[0].creationTime).toEqual(
			oldAppData.rows[0].creationTime
		);
	});

	it("merges table with row added to bottom", () => {
		const oldAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["test 1", "test 2"],
		]);
		const newAppData = findAppData([
			["Column 1", "Column 2"],
			["123456", ""],
			["text", "text"],
			["test 1", "test 2"],
			["test 3", "test 4"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		//Check content
		expect(merged.rows[0].creationTime).toEqual(
			oldAppData.rows[0].creationTime
		);
		expect(merged.rows[1].creationTime).toEqual(
			newAppData.rows[1].creationTime
		);
	});
});
