import {
	findTableModel,
	parseCellsFromMarkdownTable,
} from "../external/loadUtils";
import { mockMarkdownTable, mockSettings } from "../mock";
import { addColumn, addRow } from "./add";

describe("addRow", () => {
	it("adds an empty row", () => {
		const numColumns = 2;
		const markdown = mockMarkdownTable(numColumns, 3, "table-id-0");
		const cells = parseCellsFromMarkdownTable({
			text: markdown,
			lineStart: 0,
			lineEnd: 4,
		});
		const model = findTableModel(cells, cells, numColumns);
		const newModel = addRow(model);
		expect(newModel.cells.length).toEqual(model.cells.length + numColumns);
	});
});

describe("addColumn", () => {
	it("adds an empty column", () => {
		const numColumns = 2;
		const markdown = mockMarkdownTable(numColumns, 0, "table-id-0");
		const cells = parseCellsFromMarkdownTable({
			text: markdown,
			lineStart: 0,
			lineEnd: 4,
		});
		console.log(markdown);
		console.log(cells);
		const model = findTableModel(cells, cells, numColumns);
		const settings = mockSettings(numColumns);
		const [newModel] = addColumn(model, settings);
		console.log(newModel.cells);
		expect(newModel.cells.length).toEqual(model.cells.length + 3);
	});
});
