import {
	MARKDOWN_CELLS_REGEX,
	MARKDOWN_HYPHEN_CELL_REGEX,
	MARKDOWN_ROWS_REGEX,
} from "./";

describe("MARKDOWN_HYPHEN_CELL_REGEX", () => {
	it("matches hyphen cell", () => {
		const match = "------|".match(MARKDOWN_HYPHEN_CELL_REGEX);
		expect(match.length).toEqual(1);
	});

	it("matches hyphen cell with spaces", () => {
		const match = "  ------   |".match(MARKDOWN_HYPHEN_CELL_REGEX);
		expect(match.length).toEqual(1);
	});

	it("matches hyphen cell with tabs", () => {
		const match = " ---- \t|".match(MARKDOWN_HYPHEN_CELL_REGEX);
		expect(match.length).toEqual(1);
	});

	it("doesn't match invalid hyphen cell", () => {
		const match = " --\t |".match(MARKDOWN_HYPHEN_CELL_REGEX);
		expect(match).toEqual(null);
	});
});

describe("MARKDOWN_CELLS_REGEX", () => {
	it("matches markdown cells", () => {
		const matches = "|test|test|test|".match(MARKDOWN_CELLS_REGEX);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual("test|");
		expect(matches[1]).toEqual("test|");
		expect(matches[2]).toEqual("test|");
	});

	it("matches markdown cells with hyphens", () => {
		const matches = "|---|-----|---|".match(MARKDOWN_CELLS_REGEX);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual("---|");
		expect(matches[1]).toEqual("-----|");
		expect(matches[2]).toEqual("---|");
	});

	it("matches markdown cells with spaces", () => {
		const matches = "| test 1 | test 2 | test 3 |".match(
			MARKDOWN_CELLS_REGEX
		);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual(" test 1 |");
		expect(matches[1]).toEqual(" test 2 |");
		expect(matches[2]).toEqual(" test 3 |");
	});

	it("matches markdown cells with tabs", () => {
		const matches = "| test 1\t| test 2\t| test 3\t|".match(
			MARKDOWN_CELLS_REGEX
		);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual(" test 1\t|");
		expect(matches[1]).toEqual(" test 2\t|");
		expect(matches[2]).toEqual(" test 3\t|");
	});
});

describe("MARKDOWN_ROWS_REGEX", () => {
	it("matches markdown row", () => {
		const matches = "|test|test|test|".match(MARKDOWN_ROWS_REGEX);
		expect(matches.length).toEqual(1);
		expect(matches[0]).toEqual("|test|test|test|");
	});

	it("matches markdown row with hyphens", () => {
		const matches = "|---|-----|---|".match(MARKDOWN_ROWS_REGEX);
		expect(matches.length).toEqual(1);
		expect(matches[0]).toEqual("|---|-----|---|");
	});

	it("matches markdown row with spaces", () => {
		const matches = "| test 1 | test 2 | test 3 |".match(
			MARKDOWN_ROWS_REGEX
		);
		expect(matches.length).toEqual(1);
		expect(matches[0]).toEqual("| test 1 | test 2 | test 3 |");
	});

	it("matches markdown rows with tabs", () => {
		const matches = "| test 1\t| test 2\t| test 3\t|".match(
			MARKDOWN_ROWS_REGEX
		);
		expect(matches.length).toEqual(1);
		expect(matches[0]).toEqual("| test 1\t| test 2\t| test 3\t|");
	});
});
