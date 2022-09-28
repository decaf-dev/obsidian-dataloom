import { changeColumnType } from "./column";
import { mockTableState } from "../mock";
import { CellType } from "../table/types";
import { randomTagId } from "../random";

describe("changeColumnType", () => {
	it("changes from text to multi-tag", () => {
		const state = mockTableState(1, 3);

		const tagCell1 = state.model.cells[1];
		tagCell1.markdown = "tag1,tag2";
		tagCell1.html = "tag1,tag2";

		const tagCell2 = state.model.cells[2];
		tagCell2.markdown = "tag1";
		tagCell2.html = "tag1";

		const newState = changeColumnType(
			state,
			tagCell1.columnId,
			CellType.MULTI_TAG
		);

		const tags = newState.settings.columns[tagCell1.columnId].tags;
		expect(tags.length).toEqual(2);
		expect(tags[0].markdown).toEqual("tag1");
		expect(tags[0].html).toEqual("tag1");
		expect(tags[0].cells.length).toEqual(2);

		expect(tags[1].markdown).toEqual("tag2");
		expect(tags[1].html).toEqual("tag2");
		expect(tags[1].cells.length).toEqual(1);
	});

	it("changes from multi-tag to text", () => {
		const state = mockTableState(1, 3);

		const tagCell1 = state.model.cells[1];
		tagCell1.markdown = "tag1,tag2";
		tagCell1.html = "tag1,tag2";

		const tagCell2 = state.model.cells[2];
		tagCell2.markdown = "tag1";
		tagCell2.html = "tag1";

		const columnSettings = state.settings.columns[tagCell1.columnId];
		columnSettings.type = CellType.MULTI_TAG;
		columnSettings.tags = [
			{
				id: randomTagId(),
				markdown: "tag1",
				html: "tag1",
				color: "green",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
					{
						rowId: tagCell2.rowId,
						columnId: tagCell2.columnId,
					},
				],
			},
			{
				id: randomTagId(),
				markdown: "tag2",
				html: "tag2",
				color: "blue",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
				],
			},
		];

		const newState = changeColumnType(
			state,
			tagCell1.columnId,
			CellType.TEXT
		);

		const tags = newState.settings.columns[tagCell1.columnId].tags;
		expect(tags.length).toEqual(2);
		expect(tags[0].markdown).toEqual("tag1");
		expect(tags[0].html).toEqual("tag1");
		expect(tags[0].cells.length).toEqual(0);

		expect(tags[1].markdown).toEqual("tag2");
		expect(tags[1].html).toEqual("tag2");
		expect(tags[1].cells.length).toEqual(0);
	});

	it("changes from multi-tag to tag", () => {
		const state = mockTableState(1, 3);

		const tagCell1 = state.model.cells[1];
		tagCell1.markdown = "tag1,tag2";
		tagCell1.html = "tag1,tag2";

		const tagCell2 = state.model.cells[2];
		tagCell2.markdown = "tag1";
		tagCell2.html = "tag1";

		const columnSettings = state.settings.columns[tagCell1.columnId];
		columnSettings.type = CellType.MULTI_TAG;
		columnSettings.tags = [
			{
				id: randomTagId(),
				markdown: "tag1",
				html: "tag1",
				color: "green",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
					{
						rowId: tagCell2.rowId,
						columnId: tagCell2.columnId,
					},
				],
			},
			{
				id: randomTagId(),
				markdown: "tag2",
				html: "tag2",
				color: "blue",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
				],
			},
		];

		const newState = changeColumnType(
			state,
			tagCell1.columnId,
			CellType.TAG
		);

		const tags = newState.settings.columns[tagCell1.columnId].tags;
		expect(tags.length).toEqual(2);
		expect(tags[0].markdown).toEqual("tag1");
		expect(tags[0].html).toEqual("tag1");
		expect(tags[0].cells.length).toEqual(2);
		expect(tags[0].cells).toEqual([
			{
				rowId: tagCell1.rowId,
				columnId: tagCell1.columnId,
			},
			{
				rowId: tagCell2.rowId,
				columnId: tagCell2.columnId,
			},
		]);

		expect(tags[1].markdown).toEqual("tag2");
		expect(tags[1].html).toEqual("tag2");
		expect(tags[1].cells.length).toEqual(0);
	});
});
