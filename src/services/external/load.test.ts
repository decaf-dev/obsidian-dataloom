import { replaceTableInText } from "./save";

const TABLE_TEXT = "| Column 1 |\n| ---------- |\n|            |";

describe("replaceTextInText", () => {
	it("Replaces table text", () => {
		const text = TABLE_TEXT;
		const replaced = replaceTableInText(text, 0, 2, "table");
		expect(replaced).toEqual("table");
	});
	it("Replaces table with text at start", () => {
		const text = "Some text\n" + TABLE_TEXT;
		const replaced = replaceTableInText(text, 1, 3, "table");
		expect(replaced).toEqual("Some text\ntable");
	});
	it("Replaces table with text at end", () => {
		const text = TABLE_TEXT + "\nSome text";
		const replaced = replaceTableInText(text, 0, 2, "table");
		expect(replaced).toEqual("table\nSome text");
	});
});
