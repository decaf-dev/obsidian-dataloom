import {
	findTableModel,
	parseCellsFromMarkdownTable,
} from "../external/loadUtils";
import { mockMarkdownTable } from "../mock";
import { addRow } from "./add";

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
