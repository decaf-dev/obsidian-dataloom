import {
	isMarkdownTable,
	isNumber,
	isTag,
	hasSquareBrackets,
	hasValidHeaderRow,
	hasValidTypeDefinitionRow,
	hasValidColumnIds,
	hasValidRowIds,
} from ".";

describe("hasValidHeaderRow", () => {
	it("returns true if the last cell is empty", () => {
		const parsedTable = [["Column 1", "Column 2", ""]];
		const isValid = hasValidHeaderRow(parsedTable);
		expect(isValid).toEqual(true);
	});

	it("returns false if the parsed table contains no rows", () => {
		const parsedTable = [];
		const isValid = hasValidHeaderRow(parsedTable);
		expect(isValid).toEqual(false);
	});

	it("returns false if the last cell is not empty", () => {
		const parsedTable = [["Column 1", "Column 2", "Column 3"]];
		const isValid = hasValidHeaderRow(parsedTable);
		expect(isValid).toEqual(false);
	});
});

describe("hasValidTypeDefinitionRow", () => {
	it("returns true if the parsed table contains a valid type definition row", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
		];
		const isValid = hasValidTypeDefinitionRow(parsedTable);
		expect(isValid).toEqual(true);
	});

	it("returns false if the parsed table only contains a header row", () => {
		const parsedTable = [["", "Column 1", "Column 2", "Column 3"]];
		const isValid = hasValidTypeDefinitionRow(parsedTable);
		expect(isValid).toEqual(false);
	});

	it("returns false if the first cell is not empty", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["Not Empty", "text", "number", "tag"],
		];
		const isValid = hasValidTypeDefinitionRow(parsedTable);
		expect(isValid).toEqual(false);
	});

	it("returns false if the type definition row contains unsupported types", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "unsupported"],
		];
		const isValid = hasValidTypeDefinitionRow(parsedTable);
		expect(isValid).toEqual(false);
	});
});

describe("hasValidColumnIds", () => {
	it("returns true if the parsed table contains a valid column ids", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
			[
				"table-id-123456",
				"column-id-123456",
				"column-id-234567",
				"column-id-345678",
			],
		];
		const isValid = hasValidColumnIds(parsedTable);
		expect(isValid).toEqual(true);
	});

	it("returns false if the parsed table is missing the column id row", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
		];
		const isValid = hasValidColumnIds(parsedTable);
		expect(isValid).toEqual(false);
	});

	it("returns false if the row contains invalid ids", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
			[
				"table-id-123456",
				"column-id-123456",
				"column-id-234567",
				"column-id-345",
			],
		];
		const isValid = hasValidColumnIds(parsedTable);
		expect(isValid).toEqual(false);
	});

	it("returns false if column ids are the same", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
			[
				"table-id-123456",
				"column-id-123456",
				"column-id-123456",
				"column-id-345678",
			],
		];
		const isValid = hasValidColumnIds(parsedTable);
		expect(isValid).toEqual(false);
	});
});

describe("hasValidRowIds", () => {
	it("returns true if there are no rows", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
			["", "column-id-123456", "column-id-234567", "column-id-345678"],
		];
		const isValid = hasValidRowIds(parsedTable);
		expect(isValid).toEqual(true);
	});

	it("returns true if there are rows with valid ids", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
			["", "column-id-123456", "column-id-234567", "column-id-345678"],
			["row-id-123456", "Test 1", "Test 2", "Test 3"],
		];
		const isValid = hasValidRowIds(parsedTable);
		expect(isValid).toEqual(true);
	});

	it("returns false if the first cell is empty", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
			["", "column-id-123456", "column-id-234567", "column-id-345678"],
			["", "Test 1", "Test 2", "Test 3"],
		];
		const isValid = hasValidRowIds(parsedTable);
		expect(isValid).toEqual(false);
	});

	it("returns false if the row contains invalid ids", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
			["", "column-id-123456", "column-id-234567", "column-id-345678"],
			["row-id-123456", "Test 1", "Test 2", "Test 3"],
			["row-id-1234", "Test 1", "Test 2", "Test 3"],
		];
		const isValid = hasValidRowIds(parsedTable);
		expect(isValid).toEqual(false);
	});

	it("returns false if the row ids are the same", () => {
		const parsedTable = [
			["", "Column 1", "Column 2", "Column 3"],
			["", "text", "number", "tag"],
			["", "column-id-123456", "column-id-234567", "column-id-345678"],
			["row-id-123456", "Test 1", "Test 2", "Test 3"],
			["row-id-123456", "Test 1", "Test 2", "Test 3"],
		];
		const isValid = hasValidRowIds(parsedTable);
		expect(isValid).toEqual(false);
	});
});

describe("isMarkdownTable", () => {
	it("return true if valid", () => {
		const isValid = isMarkdownTable("| test |\n| ---- |");
		expect(isValid).toEqual(true);
	});

	it("return false if invalid", () => {
		const isValid = isMarkdownTable("");
		expect(isValid).toEqual(false);
	});

	it("return false if hyphen cell count doesn't match header cell count", () => {
		const isValid = isMarkdownTable("| test | test 2 |\n| --- |");
		expect(isValid).toEqual(false);
	});
});

describe("isNumber", () => {
	it("returns true if number", () => {
		const value = isNumber("123456");
		expect(value).toEqual(true);
	});

	it("returns false if a number with a space", () => {
		const value = isNumber("123 567");
		expect(value).toEqual(false);
	});

	it("returns false if text", () => {
		const value = isNumber("ABC123");
		expect(value).toEqual(false);
	});
});

describe("isTag", () => {
	it("matches a tag", () => {
		const value = isTag("#tag");
		expect(value).toEqual(true);
	});

	it("doesn't match multiple tags", () => {
		const value = isTag("#tag1 #tag2");
		expect(value).toEqual(false);
	});

	it("doesn't match tag in a link", () => {
		const value = isTag(
			"https://chakra-ui.com/blog/the-beginners-guide-to-building-an-accessible-web#build-a-web-thats-inclusive-of-everyone "
		);
		expect(value).toEqual(false);
	});
});

describe("hasSquareBrackets", () => {
	it("returns true if has square brackets", () => {
		const output = hasSquareBrackets("[[test file name]]");
		expect(output).toEqual(true);
	});

	it("returns false if doesn't have square brackets", () => {
		const output = hasSquareBrackets("test file name");
		expect(output).toEqual(false);
	});

	it("returns false if square brackets are incomplete", () => {
		const output = hasSquareBrackets("test file name]]");
		expect(output).toEqual(false);
	});
});
