import {
	toTagLink,
	countNumTags,
	findCellType,
	validTypeDefinitionRow,
	findAppData,
	markdownRowsRegex,
	markdownCellsRegex,
	toFileLink,
	stripLink,
	addPound,
	stripPound,
	stripLinks,
	toExternalLink,
	stripSquareBrackets,
	hasSquareBrackets,
	parseTableFromEl,
	findMarkdownTablesFromFileData,
	parseTableFromMarkdown,
	markdownHyphenCellRegex,
	isMarkdownTable,
	hashParsedTable,
	mergeAppData,
	hashMarkdownTable,
	appDataToString,
	parseURLs,
	parseFileLinks,
	pruneSettingsCache,
} from "./index";

import { CELL_TYPE } from "../../constants";
import { mockTable } from "../mockData";

describe("pruneSettingsCache", () => {
	it("keeps hashes that are found in the file", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["text", "text"],
			["some text", "some more text"],
		];
		const appData = findAppData(parsedTable);
		const markdownTable = appDataToString(appData);
		const fileData = `test ${markdownTable} test`;
		const hash = hashMarkdownTable(markdownTable);
		const sourcePath = "test";

		const settings = { appData: { [sourcePath]: { [hash]: appData } } };
		const newSettings = pruneSettingsCache(settings, sourcePath, fileData);
		expect(newSettings.appData[sourcePath][hash]).toEqual(appData);
	});

	it("removes hash that doesn't exist", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["text", "text"],
			["some text", "some more text"],
		];
		const appData = findAppData(parsedTable);
		const markdownTable = appDataToString(appData);
		const fileData = `test ${markdownTable} test`;
		const sourcePath = "test";

		const settings = { appData: { [sourcePath]: { [123456]: appData } } };
		const newSettings = pruneSettingsCache(settings, sourcePath, fileData);
		expect(newSettings.appData[sourcePath][1233456]).toBe(undefined);
	});
});

describe("hashMarkdownTable", () => {
	it("returns the same hash for the same data", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["text", "text"],
			["some text", "some more text"],
		];
		const appData = findAppData(parsedTable);
		const markdownTable = appDataToString(appData);
		const hash1 = hashMarkdownTable(markdownTable);
		const hash2 = hashMarkdownTable(markdownTable);
		expect(hash1).toEqual(hash2);
	});

	it("returns the same hash as hashParsedTable", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["text", "text"],
			["some text", "some more text"],
		];
		const appData = findAppData(parsedTable);
		const markdownTable = appDataToString(appData);
		const hash1 = hashMarkdownTable(markdownTable);
		const hash2 = hashParsedTable(parsedTable);
		expect(hash1).toEqual(hash2);
	});
});

describe("hashParsedTable", () => {
	it("returns the same hash for the same data", () => {
		const parsedTable = [
			["Column 1", "Column 2"],
			["text", "text"],
			["some text", "some more text"],
		];
		const hash1 = hashParsedTable(parsedTable);
		const hash2 = hashParsedTable(parsedTable);
		expect(hash1).toEqual(hash2);
	});
});

describe("mergeAppData", () => {
	it("merges new cell content", () => {
		const oldAppData = findAppData([
			["column1", "column2"],
			["text", "text"],
			["test1", "test2"],
		]);
		const newAppData = findAppData([
			["column1", "column2"],
			["text", "text"],
			["updated1", "updated2"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		//Check content
		expect(merged.cells[0].content).toEqual("updated1");
		expect(merged.cells[1].content).toEqual("updated2");
	});

	it("merges new tag content", () => {
		const oldAppData = findAppData([
			["column1", "column2"],
			["tag", "tag"],
			["#tag1", "#tag2"],
		]);
		const newAppData = findAppData([
			["column1", "column2"],
			["tag", "tag"],
			["#updated1", "#updated2"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		expect(merged.tags[0].content).toEqual("updated1");
		expect(merged.tags[1].content).toEqual("updated2");
	});

	it("merges new cell content", () => {
		const oldAppData = findAppData([
			["column1", "column2"],
			["tag", "tag"],
			["#tag1", "#tag2"],
		]);
		const newAppData = findAppData([
			["column1", "column2"],
			["tag", "tag"],
			["#tag2", "#tag3"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		expect(merged.tags[0].color).toEqual(oldAppData.tags[1].color);
		expect(merged.tags[1].color).toEqual(newAppData.tags[1].color);
		expect(merged.tags[0].content).toEqual("tag2");
		expect(merged.tags[1].content).toEqual("tag3");
	});

	it("merges row creation times", () => {
		const oldAppData = findAppData([
			["column1", "column2"],
			["text", "text"],
			["row1-cell1", "row1-cell2"],
			["row2-cell1", "row2-cell2"],
		]);
		const newAppData = findAppData([
			["column1", "column2"],
			["text", "text"],
			["updated-row1-cell1", "updated-row1-cell2"],
			["updated-row2-cell1", "updated-row2-cell2"],
		]);

		const merged = mergeAppData(oldAppData, newAppData);
		expect(merged.rows[0].creationTime).toEqual(
			oldAppData.rows[0].creationTime
		);
		expect(merged.rows[1].creationTime).toEqual(
			newAppData.rows[1].creationTime
		);
	});
});

describe("findAppData", () => {
	it("finds text data", () => {
		const table = [
			["Column 1", "Column 2"],
			["text", "text"],
			["some text", "some more text"],
		];
		const data = findAppData(table);
		expect(data.headers.length).toEqual(2);
		expect(data.rows.length).toEqual(1);
		expect(data.cells.length).toEqual(2);
		expect(data.tags.length).toEqual(0);
	});

	it("finds tag data", () => {
		const table = [
			["Column 1", "Column 2"],
			["tag", "tag"],
			["#tag1", "#tag2"],
		];
		const data = findAppData(table);
		expect(data.headers.length).toEqual(2);
		expect(data.rows.length).toEqual(1);
		expect(data.cells.length).toEqual(2);
		expect(data.tags.length).toEqual(2);
	});
});

describe("validTypeDefinitionRow", () => {
	it("returns true if row exists", () => {
		const table = [
			["Column 1", "Column 2"],
			["text", "text"],
		];
		const hasTDR = validTypeDefinitionRow(table);
		expect(hasTDR).toBe(true);
	});

	it("returns false if no row exists", () => {
		const table = [["Column 1", "Column 2"]];
		const hasTDR = validTypeDefinitionRow(table);
		expect(hasTDR).toBe(false);
	});

	it("returns false if invalid types", () => {
		const table = [
			["Column 1", "Column 2"],
			["text", "invalid"],
		];
		const hasTDR = validTypeDefinitionRow(table);
		expect(hasTDR).toBe(false);
	});
});

describe("findCellType", () => {
	it("returns expected type if empty", () => {
		const type = findCellType("", CELL_TYPE.TEXT);
		expect(type).toEqual(CELL_TYPE.TEXT);
	});

	it("returns TEXT if number and expected type is TEXT", () => {
		const type = findCellType("123", CELL_TYPE.TEXT);
		expect(type).toEqual(CELL_TYPE.TEXT);
	});

	it("returns NUMBER if number and expected type is NUMBER", () => {
		const type = findCellType("123", CELL_TYPE.NUMBER);
		expect(type).toEqual(CELL_TYPE.NUMBER);
	});

	it("returns TAG if there is a tag", () => {
		const type = findCellType("#test", CELL_TYPE.TAG);
		expect(type).toEqual(CELL_TYPE.TAG);
	});

	it("returns TAG if there are multiple tags", () => {
		const type = findCellType("#test #test2", CELL_TYPE.MULTI_TAG);
		expect(type).toEqual(CELL_TYPE.MULTI_TAG);
	});

	it("returns ERROR if doesn't include only a tag", () => {
		const type = findCellType("#test test", CELL_TYPE.TAG);
		expect(type).toEqual(CELL_TYPE.ERROR);
	});

	it("returns ERROR if expected doesn't match cell type", () => {
		const type = findCellType("1234", CELL_TYPE.TAG);
		expect(type).toEqual(CELL_TYPE.ERROR);
	});
});

describe("findMarkdownTablesFromFileData", () => {
	it("finds single column tables from data", () => {
		const tables = findMarkdownTablesFromFileData(
			"|test  |\n|----|\n| text   |\n| this is some text |\n\n\n\n|  test |\n| --- |"
		);
		expect(tables.length).toEqual(2);
		expect(tables[0]).toEqual(
			"|test  |\n|----|\n| text   |\n| this is some text |\n"
		);
		expect(tables[1]).toEqual("|  test |\n| --- |");
	});

	it("finds multi column tables from data", () => {
		const tables = findMarkdownTablesFromFileData(
			"| test 1 | test 2 |\n| ---- | ----- |\n| text | text |\n| this is some text | more text |\n\n\n\n|  test |\n| ---- |"
		);
		expect(tables.length).toEqual(2);
		expect(tables[0]).toEqual(
			"| test 1 | test 2 |\n| ---- | ----- |\n| text | text |\n| this is some text | more text |\n"
		);
		expect(tables[1]).toEqual("|  test |\n| ---- |");
	});

	it("returns empty array if no tables exist", () => {
		const tables = findMarkdownTablesFromFileData("test test test");
		expect(tables.length).toEqual(0);
		expect(tables).toEqual([]);
	});

	it("returns empty array if invalid table", () => {
		const tables = findMarkdownTablesFromFileData("| test 1 |");
		expect(tables.length).toEqual(0);
		expect(tables).toEqual([]);
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

describe("findMarkdownTablesFromFileData", () => {
	it("parses a valid single column table", () => {
		const parsedTable = parseTableFromMarkdown(
			"|test|\n|---|\n|text|\n|this is some text|"
		);
		expect(parsedTable).toEqual([
			["test"],
			["text"],
			["this is some text"],
		]);
	});

	it("parses a valid single column table and trims cell content", () => {
		const parsedTable = parseTableFromMarkdown(
			"| test 1 |\n| --- |\n| text |\n| this is some text |"
		);
		expect(parsedTable).toEqual([
			["test 1"],
			["text"],
			["this is some text"],
		]);
	});

	it("parses valid multi-column table", () => {
		const parsedTable = parseTableFromMarkdown(
			"| test 1 | test 2 |\n| ---- | ------ |\n| text   |  tag |\n| this is some text | yes |"
		);
		expect(parsedTable).toEqual([
			["test 1", "test 2"],
			["text", "tag"],
			["this is some text", "yes"],
		]);
	});
});

describe("parseTableFromEl", () => {
	it("parses table", () => {
		const table = mockTable(
			["test 1", "test 2"],
			[
				["cell 1", "cell 2"],
				["cell 3", "cell 4"],
			]
		);
		const parsedTable = parseTableFromEl(table);
		expect(parsedTable).toEqual([
			["test 1", "test 2"],
			["cell 1", "cell 2"],
			["cell 3", "cell 4"],
		]);
	});
});

describe("markdownHyphenCellRegex", () => {
	it("matches hyphen cell", () => {
		const match = "------|".match(markdownHyphenCellRegex);
		expect(match.length).toEqual(1);
	});

	it("matches hyphen cell with spaces", () => {
		const match = "  ------   |".match(markdownHyphenCellRegex);
		expect(match.length).toEqual(1);
	});

	it("matches hyphen cell with tabs", () => {
		const match = " ---- \t|".match(markdownHyphenCellRegex);
		expect(match.length).toEqual(1);
	});

	it("doesn't match invalid hyphen cell", () => {
		const match = " --\t |".match(markdownHyphenCellRegex);
		expect(match).toEqual(null);
	});
});

describe("markdownCellsRegex", () => {
	it("matches markdown cells", () => {
		const matches = "|test|test|test|".match(markdownCellsRegex);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual("test|");
		expect(matches[1]).toEqual("test|");
		expect(matches[2]).toEqual("test|");
	});

	it("matches markdown cells with hyphens", () => {
		const matches = "|---|-----|---|".match(markdownCellsRegex);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual("---|");
		expect(matches[1]).toEqual("-----|");
		expect(matches[2]).toEqual("---|");
	});

	it("matches markdown cells with spaces", () => {
		const matches = "| test 1 | test 2 | test 3 |".match(
			markdownCellsRegex
		);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual(" test 1 |");
		expect(matches[1]).toEqual(" test 2 |");
		expect(matches[2]).toEqual(" test 3 |");
	});

	it("matches markdown cells with tabs", () => {
		const matches = "| test 1\t| test 2\t| test 3\t|".match(
			markdownCellsRegex
		);
		expect(matches.length).toEqual(3);
		expect(matches[0]).toEqual(" test 1\t|");
		expect(matches[1]).toEqual(" test 2\t|");
		expect(matches[2]).toEqual(" test 3\t|");
	});
});

describe("markdownRowsRegex", () => {
	it("matches markdown row", () => {
		const matches = "|test|test|test|".match(markdownRowsRegex);
		expect(matches.length).toEqual(1);
		expect(matches[0]).toEqual("|test|test|test|");
	});

	it("matches markdown row with hyphens", () => {
		const matches = "|---|-----|---|".match(markdownRowsRegex);
		expect(matches.length).toEqual(1);
		expect(matches[0]).toEqual("|---|-----|---|");
	});

	it("matches markdown row with spaces", () => {
		const matches = "| test 1 | test 2 | test 3 |".match(markdownRowsRegex);
		expect(matches.length).toEqual(1);
		expect(matches[0]).toEqual("| test 1 | test 2 | test 3 |");
	});

	it("matches markdown rows with tabs", () => {
		const matches = "| test 1\t| test 2\t| test 3\t|".match(
			markdownRowsRegex
		);
		expect(matches.length).toEqual(1);
		expect(matches[0]).toEqual("| test 1\t| test 2\t| test 3\t|");
	});
});

describe("countNumTags", () => {
	it("counts single tag", () => {
		const numTags = countNumTags("#test");
		expect(numTags).toEqual(1);
	});

	it("counts many tags", () => {
		const numTags = countNumTags("#one #two #three");
		expect(numTags).toEqual(3);
	});

	it("counts tags with numbers", () => {
		const numTags = countNumTags("#123 #567");
		expect(numTags).toEqual(2);
	});

	it("counts tags with uppercase", () => {
		const numTags = countNumTags("#TEST");
		expect(numTags).toEqual(1);
	});

	it("counts tags with underscore", () => {
		const numTags = countNumTags("#test_test2");
		expect(numTags).toEqual(1);
	});

	it("counts tags with hyphen", () => {
		const numTags = countNumTags("#test-test2");
		expect(numTags).toEqual(1);
	});

	it("counts tag in middle of test", () => {
		const numTags = countNumTags("test #test test");
		expect(numTags).toEqual(1);
	});
});

describe("stripSquareBrackets", () => {
	it("strips square brackets ", () => {
		const output = stripSquareBrackets("[[test file name]]");
		expect(output).toEqual("test file name");
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

describe("parseFileLinks", () => {
	it("parses a file link", () => {
		const parsed = parseFileLinks("[[test]]");
		expect(parsed).toEqual(
			'<a data-href="test" href="test" class="internal-link" target="_blank" rel="noopener">test</a>'
		);
	});

	it("parses multiple file links", () => {
		const parsed = parseFileLinks("[[test]] [[test2]]");
		expect(parsed).toEqual(
			'<a data-href="test" href="test" class="internal-link" target="_blank" rel="noopener">test</a> <a data-href="test2" href="test2" class="internal-link" target="_blank" rel="noopener">test2</a>'
		);
	});

	//TODO parses same link
});

describe("parseURLs", () => {
	it("parses a url", () => {
		const parsed = parseURLs("https://test.com");
		expect(parsed).toEqual(
			'<a href="https://test.com" target="_blank" rel="noopener">https://test.com</a>'
		);
	});

	it("parses multiple urls", () => {
		const parsed = parseURLs("https://test.com https://test2.com");
		expect(parsed).toEqual(
			'<a href="https://test.com" target="_blank" rel="noopener">https://test.com</a> <a href="https://test2.com" target="_blank" rel="noopener">https://test2.com</a>'
		);
	});

	//TODO parses same link
});

describe("stripLinks", () => {
	it("strips link", () => {
		const output = stripLinks("<a>#test</a>");
		expect(output).toEqual("#test");
	});

	it("strips link with attributes", () => {
		const output = stripLinks('<a href="test">#test</a>');
		expect(output).toEqual("#test");
	});

	it("strips links in text", () => {
		const output = stripLinks('text <a href="test">#test</a> text');
		expect(output).toEqual("text #test text");
	});

	it("strips multiple links in text", () => {
		const output = stripLinks(
			'text <a href="test">#test</a> text <a href="test">#test2</a>'
		);
		expect(output).toEqual("text #test text #test2");
	});

	it("replaces links with square brackets", () => {
		const output = stripLinks(
			'text <a href="test">test</a> text <a href="test">test2</a>',
			true
		);
		expect(output).toEqual("text [[test]] text [[test2]]");
	});
});

describe("stripLink", () => {
	it("strips link", () => {
		const output = stripLink("<a>test</a>");
		expect(output).toEqual("test");
	});

	it("strips link with attributes", () => {
		const output = stripLink('<a href="test">test</a>');
		expect(output).toEqual("test");
	});
});

describe("stripPound", () => {
	it("strips pound", () => {
		const output = stripPound("#test");
		expect(output).toEqual("test");
	});
});

describe("addPound", () => {
	it("adds pounds", () => {
		const output = addPound("test");
		expect(output).toEqual("#test");
	});
});

describe("toExternalLink", () => {
	it("creates a external link", () => {
		const link = toExternalLink("https://test.com");
		expect(link).toEqual(
			'<a href="https://test.com" target="_blank" rel="noopener">https://test.com</a>'
		);
	});
});

describe("toFileLink", () => {
	it("creates an internal file link", () => {
		const link = toFileLink("test");
		expect(link).toEqual(
			'<a data-href="test" href="test" class="internal-link" target="_blank" rel="noopener">test</a>'
		);
	});
});

describe("toTagLink", () => {
	it("creates an internal tag link", () => {
		const link = toTagLink("test");
		expect(link).toEqual(
			'<a href="#test" class="tag" target="_blank" rel="noopener">test</a>'
		);
	});

	it("throws error when tag name starts with pound", () => {
		expect(() => {
			toTagLink("#test");
		}).toThrow("tagName cannot start with pound symbol");
	});
});
