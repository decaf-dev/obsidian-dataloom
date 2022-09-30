import { randomTagId } from "../random";
import { mockTableState } from "../mock";
import { addNewTag, removeTag, addExistingTag } from "./tag";

describe("addNewTag", () => {
	it("adds a tag to a column that has no tags", () => {
		const state = mockTableState(1, 2);

		const tagCell = state.model.cells[1];
		const newState = addNewTag(
			state,
			tagCell.id,
			tagCell.columnId,
			tagCell.rowId,
			"tag1",
			"tag1",
			"blue",
			false
		);
		const newTags = newState.settings.columns[tagCell.columnId].tags;
		expect(newState.model.cells[0]).toEqual(state.model.cells[0]);
		expect(newState.model.cells[1]).toEqual({
			...state.model.cells[1],
			markdown: "tag1",
			html: "tag1",
		});
		expect(newTags.length).toEqual(1);
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("blue");
		expect(newTags[0].cells).toEqual([
			{
				columnId: tagCell.columnId,
				rowId: tagCell.rowId,
			},
		]);
	});

	it("adds a tag to a column that has 1 tag", () => {
		const state = mockTableState(1, 2);
		const tagCell1 = state.model.cells[0];
		state.settings.columns[tagCell1.columnId].tags = [
			{
				id: randomTagId(),
				html: "tag1",
				markdown: "tag1",
				color: "green",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
				],
			},
		];

		const tagCell2 = state.model.cells[1];
		const newState = addNewTag(
			state,
			tagCell2.id,
			tagCell2.columnId,
			tagCell2.rowId,
			"tag2",
			"tag2",
			"blue",
			false
		);

		expect(newState.model.cells[0]).toEqual(state.model.cells[0]);
		expect(newState.model.cells[1]).toEqual({
			...state.model.cells[1],
			markdown: "tag2",
			html: "tag2",
		});

		const newTags = newState.settings.columns[tagCell1.columnId].tags;
		expect(newTags.length).toEqual(2);
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("green");
		expect(newTags[0].cells).toEqual([
			{
				columnId: tagCell1.columnId,
				rowId: tagCell1.rowId,
			},
		]);

		expect(newTags[1].markdown).toEqual("tag2");
		expect(newTags[1].html).toEqual("tag2");
		expect(newTags[1].color).toEqual("blue");
		expect(newTags[1].cells).toEqual([
			{
				columnId: tagCell2.columnId,
				rowId: tagCell2.rowId,
			},
		]);
	});

	it("adds a tag to a column whose cell already has a tag", () => {
		const state = mockTableState(1, 2);

		const tagCell = state.model.cells[1];
		tagCell.markdown = "tag1";
		tagCell.html = "tag1";
		state.settings.columns[tagCell.columnId].tags = [
			{
				id: randomTagId(),
				markdown: "tag1",
				html: "tag1",
				color: "green",
				cells: [
					{
						rowId: tagCell.rowId,
						columnId: tagCell.columnId,
					},
				],
			},
		];

		const newState = addNewTag(
			state,
			tagCell.id,
			tagCell.columnId,
			tagCell.rowId,
			"tag2",
			"tag2",
			"blue",
			false
		);

		expect(newState.model.cells[1]).toEqual({
			...state.model.cells[1],
			markdown: "tag2",
			html: "tag2",
		});

		const newTags = newState.settings.columns[tagCell.columnId].tags;
		expect(newTags.length).toEqual(2);
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("green");
		expect(newTags[0].cells.length).toEqual(0);

		expect(newTags[1].markdown).toEqual("tag2");
		expect(newTags[1].html).toEqual("tag2");
		expect(newTags[1].color).toEqual("blue");
		expect(newTags[1].cells).toEqual([
			{
				columnId: tagCell.columnId,
				rowId: tagCell.rowId,
			},
		]);
	});

	it("adds a tag to a column whose cell already has a tag and keeps previous tag", () => {
		const state = mockTableState(1, 2);

		const tagCell = state.model.cells[1];
		tagCell.markdown = "tag1";
		tagCell.html = "tag1";
		state.settings.columns[tagCell.columnId].tags = [
			{
				id: randomTagId(),
				markdown: "tag1",
				html: "tag1",
				color: "green",
				cells: [
					{
						rowId: tagCell.rowId,
						columnId: tagCell.columnId,
					},
				],
			},
		];

		const newState = addNewTag(
			state,
			tagCell.id,
			tagCell.columnId,
			tagCell.rowId,
			"tag2",
			"tag2",
			"blue",
			true
		);

		expect(newState.model.cells[0]).toEqual(state.model.cells[0]);
		expect(newState.model.cells[1]).toEqual({
			...state.model.cells[1],
			markdown: "tag1,tag2",
			html: "tag1,tag2",
		});

		const newTags = newState.settings.columns[tagCell.columnId].tags;
		expect(newTags.length).toEqual(2);
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("green");
		expect(newTags[0].cells).toEqual([
			{
				columnId: tagCell.columnId,
				rowId: tagCell.rowId,
			},
		]);

		expect(newTags[1].markdown).toEqual("tag2");
		expect(newTags[1].html).toEqual("tag2");
		expect(newTags[1].color).toEqual("blue");
		expect(newTags[1].cells).toEqual([
			{
				columnId: tagCell.columnId,
				rowId: tagCell.rowId,
			},
		]);
	});
});

describe("removeTag", () => {
	it("removes cell reference from a tag", () => {
		const state = mockTableState(1, 2);

		const tagCell = state.model.cells[1];
		tagCell.markdown = "tag1";
		tagCell.html = "tag1";

		const tagId = randomTagId();
		state.settings.columns[tagCell.columnId].tags = [
			{
				id: tagId,
				markdown: "tag1",
				html: "tag1",
				color: "blue",
				cells: [
					{
						rowId: tagCell.rowId,
						columnId: tagCell.columnId,
					},
				],
			},
		];

		const newState = removeTag(
			state,
			tagCell.id,
			tagCell.columnId,
			tagCell.rowId,
			tagId
		);

		expect(newState.model.cells[1].markdown).toEqual("");
		expect(newState.model.cells[1].html).toEqual("");

		//TODO fix switching between two types
		//Don't delete the tags, just disassociate them from cells
		const newTags = newState.settings.columns[tagCell.columnId].tags;
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("blue");
		expect(newTags[0].cells.length).toEqual(0);
	});
});

describe("addExistingTag", () => {
	it("adds an existing tag when the cell doesn't have a tag", () => {
		const state = mockTableState(1, 2);

		const tagCell1 = state.model.cells[0];
		tagCell1.markdown = "tag1";
		tagCell1.html = "tag1";

		const tagId = randomTagId();
		state.settings.columns[tagCell1.columnId].tags = [
			{
				id: tagId,
				markdown: "tag1",
				html: "tag1",
				color: "blue",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
				],
			},
		];

		const tagCell2 = state.model.cells[1];

		const newState = addExistingTag(
			state,
			tagCell2.id,
			tagCell2.columnId,
			tagCell2.rowId,
			tagId,
			false
		);

		expect(newState.model.cells[1].markdown).toEqual("tag1");
		expect(newState.model.cells[1].html).toEqual("tag1");

		const newTags = newState.settings.columns[tagCell1.columnId].tags;
		expect(newTags.length).toEqual(1);
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("blue");
		expect(newTags[0].cells.length).toEqual(2);
		expect(newTags[0].cells).toEqual([
			{
				rowId: tagCell1.rowId,
				columnId: tagCell1.columnId,
			},
			{
				rowId: tagCell2.rowId,
				columnId: tagCell2.columnId,
			},
		]);
	});

	it("adds an existing tag and removes the other cell reference", () => {
		const state = mockTableState(1, 2);

		const tagCell1 = state.model.cells[0];
		tagCell1.markdown = "tag1";
		tagCell1.html = "tag1";

		const tagId1 = randomTagId();

		const tagCell2 = state.model.cells[1];
		tagCell2.markdown = "tag2";
		tagCell2.html = "tag2";

		state.settings.columns[tagCell1.columnId].tags = [
			{
				id: tagId1,
				markdown: "tag1",
				html: "tag1",
				color: "blue",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
				],
			},
			{
				id: randomTagId(),
				markdown: "tag2",
				html: "tag2",
				color: "red",
				cells: [
					{
						rowId: tagCell2.rowId,
						columnId: tagCell2.columnId,
					},
				],
			},
		];

		const newState = addExistingTag(
			state,
			tagCell2.id,
			tagCell2.columnId,
			tagCell2.rowId,
			tagId1,
			false
		);

		expect(newState.model.cells[0].markdown).toEqual("tag1");
		expect(newState.model.cells[0].html).toEqual("tag1");
		expect(newState.model.cells[1].markdown).toEqual("tag1");
		expect(newState.model.cells[1].html).toEqual("tag1");

		const newTags = newState.settings.columns[tagCell1.columnId].tags;
		expect(newTags.length).toEqual(2);
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("blue");
		expect(newTags[0].cells.length).toEqual(2);
		expect(newTags[0].cells).toEqual([
			{
				rowId: tagCell1.rowId,
				columnId: tagCell1.columnId,
			},
			{
				rowId: tagCell2.rowId,
				columnId: tagCell2.columnId,
			},
		]);

		expect(newTags[1].markdown).toEqual("tag2");
		expect(newTags[1].html).toEqual("tag2");
		expect(newTags[1].color).toEqual("red");
		expect(newTags[1].cells.length).toEqual(0);
	});

	it("adds an existing tag and keeps the old one", () => {
		const state = mockTableState(1, 2);

		const tagCell1 = state.model.cells[0];
		tagCell1.markdown = "tag1";
		tagCell1.html = "tag1";

		const tagId1 = randomTagId();

		const tagCell2 = state.model.cells[1];
		tagCell2.markdown = "tag2";
		tagCell2.html = "tag2";

		state.settings.columns[tagCell1.columnId].tags = [
			{
				id: tagId1,
				markdown: "tag1",
				html: "tag1",
				color: "blue",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
				],
			},
			{
				id: randomTagId(),
				markdown: "tag2",
				html: "tag2",
				color: "red",
				cells: [
					{
						rowId: tagCell2.rowId,
						columnId: tagCell2.columnId,
					},
				],
			},
		];

		const newState = addExistingTag(
			state,
			tagCell2.id,
			tagCell2.columnId,
			tagCell2.rowId,
			tagId1,
			true
		);

		expect(newState.model.cells[1].markdown).toEqual("tag2,tag1");
		expect(newState.model.cells[1].html).toEqual("tag2,tag1");

		const newTags = newState.settings.columns[tagCell1.columnId].tags;
		expect(newTags.length).toEqual(2);
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("blue");
		expect(newTags[0].cells.length).toEqual(2);
		expect(newTags[0].cells).toEqual([
			{
				rowId: tagCell1.rowId,
				columnId: tagCell1.columnId,
			},
			{
				rowId: tagCell2.rowId,
				columnId: tagCell2.columnId,
			},
		]);

		expect(newTags[1].markdown).toEqual("tag2");
		expect(newTags[1].html).toEqual("tag2");
		expect(newTags[1].color).toEqual("red");
		expect(newTags[1].cells.length).toEqual(1);
		expect(newTags[1].cells).toEqual([
			{
				rowId: tagCell2.rowId,
				columnId: tagCell2.columnId,
			},
		]);
	});

	it("returns the original state when you click on the same tag", () => {
		const state = mockTableState(1, 2);

		const tagCell1 = state.model.cells[0];
		tagCell1.markdown = "tag1";
		tagCell1.html = "tag1";

		const tagId1 = randomTagId();

		state.settings.columns[tagCell1.columnId].tags = [
			{
				id: tagId1,
				markdown: "tag1",
				html: "tag1",
				color: "blue",
				cells: [
					{
						rowId: tagCell1.rowId,
						columnId: tagCell1.columnId,
					},
				],
			},
		];

		const newState = addExistingTag(
			state,
			tagCell1.id,
			tagCell1.columnId,
			tagCell1.rowId,
			tagId1,
			false
		);

		expect(newState.model.cells[0].markdown).toEqual("tag1");
		expect(newState.model.cells[0].html).toEqual("tag1");

		const newTags = newState.settings.columns[tagCell1.columnId].tags;
		expect(newTags.length).toEqual(1);
		expect(newTags[0].markdown).toEqual("tag1");
		expect(newTags[0].html).toEqual("tag1");
		expect(newTags[0].color).toEqual("blue");
		expect(newTags[0].cells.length).toEqual(1);
		expect(newTags[0].cells).toEqual([
			{
				rowId: tagCell1.rowId,
				columnId: tagCell1.columnId,
			},
		]);
	});
});
