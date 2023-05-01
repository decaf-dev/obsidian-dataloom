import { createTableState } from "src/data/tableState";
import {
	getMarkdownListItems,
	importMarkdownListItems,
	validateMarkdownList,
} from "./utils";

describe("validateMarkdownList", () => {
	it("should return true if all lines have a list item", () => {
		const list = "- Item 1\n- Item 2";
		expect(validateMarkdownList(list)).toBe(true);
	});
	it("should return true if there is whitespace before and after the list item", () => {
		const list = "  \t\t- Item 1\t\t  ";
		expect(validateMarkdownList(list)).toBe(true);
	});

	it("should return true if there is extra space between the hyphen and the list item name", () => {
		const list = "-  Item 1";
		expect(validateMarkdownList(list)).toBe(true);
	});

	it("should return false if there is an empty line", () => {
		const list = "- Item 1\n\n- Item 2";
		expect(validateMarkdownList(list)).toBe(false);
	});

	it("should return false if there is a line with white space characters", () => {
		const list = "- Item 1\n\t\t\n- Item 2";
		expect(validateMarkdownList(list)).toBe(false);
	});

	it("should return false if a line doesn't start with a hyphen", () => {
		const list = "- Item 1\nItem 2";
		expect(validateMarkdownList(list)).toBe(false);
	});
});

describe("getMarkdownListItems", () => {
	it("should return an array of list items", () => {
		const list = "- Item 1\n- Item 2";
		expect(getMarkdownListItems(list)).toEqual(["Item 1", "Item 2"]);
	});

	it("removes extra white space", () => {
		const list = " \t\t- \t Item 1\n- Item 2 \t\t ";
		expect(getMarkdownListItems(list)).toEqual(["Item 1", "Item 2"]);
	});
});

describe("updateMarkdownListItems", () => {
	it("should update the markdown of the corresponding body cell with the list item", () => {
		//Initial data
		const list = "- Item 1\n- Item 2";
		const listItems = getMarkdownListItems(list);
		const initialState = createTableState(1, 1);

		const updatedState = importMarkdownListItems(
			listItems,
			initialState.model.columns[0].id,
			initialState
		);

		//It doesn't mutate the original state
		expect(initialState.model.bodyRows.length).toBe(1);
		expect(initialState.model.bodyCells[0].markdown).toBe("");

		//It returns a new state
		expect(updatedState.model.bodyRows.length).toBe(3);
		expect(updatedState.model.bodyCells[1].markdown).toBe("Item 1");
		expect(updatedState.model.bodyCells[2].markdown).toBe("Item 2");
	});
});
