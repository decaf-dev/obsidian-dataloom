import { createEmptyMarkdownTable } from "../random";

describe("createEmptyMarkdownTable", () => {
	it("creates an empty 1 column table", () => {
		const table = createEmptyMarkdownTable();
		expect(table).toMatch(`| New Column |\n| ---------- |`);
	});
});
