import { getColumnIndex, getRowIndex, findRowCells } from "./utils";
import { Cell } from "./types";

//0,1,2,3,4
//5,6,7,8,9
//10,11,12,13,14
//15,16,17,18,19
describe("getRowIndex", () => {
	const numColumns = 5;
	it("calculates correct index for first item in a row", () => {
		const index = getRowIndex(15, numColumns);
		expect(index).toBe(3);
	});
	it("calculates correct index for last item in a row", () => {
		const index = getRowIndex(19, numColumns);
		expect(index).toBe(3);
	});
	it("calculates correct index for middle item in a row", () => {
		const index = getRowIndex(17, numColumns);
		expect(index).toBe(3);
	});
});

//0,1,2,3,4
//5,6,7,8,9
//10,11,12,13,14
//15,16,17,18,19
describe("getColumnIndex", () => {
	const numColumns = 5;
	it("calculates correct index for first column", () => {
		const index = getColumnIndex(15, numColumns);
		expect(index).toBe(0);
	});
	it("calculates correct index for middle column", () => {
		const index = getColumnIndex(17, numColumns);
		expect(index).toBe(2);
	});
	it("calculates correct index for last column", () => {
		const index = getColumnIndex(19, numColumns);
		expect(index).toBe(4);
	});
});

//0,1,2,3,4
//5,6,7,8,9
//10,11,12,13,14
//15,16,17,18,19
describe("findRowCells", () => {
	it("finds row cells", () => {
		let cells: Cell[] = [];
		for (let i = 0; i < 20; i++) {
			cells.push({
				id: i.toString(),
				textContent: "",
				content: "",
			});
		}
		const rowCells = findRowCells(2, cells, 5);
		expect(rowCells.map((cell) => cell.id)).toEqual([
			"10",
			"11",
			"12",
			"13",
			"14",
		]);
	});
});
