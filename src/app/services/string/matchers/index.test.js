import { matchURLs } from "./index";

describe("matchURLs", () => {
	it("matches http", () => {
		const matched = matchURLs("https://google.com");
		expect(matched).toEqual(["https://google.com"]);
	});
	it("matches https", () => {
		const matched = matchURLs("https://google.com");
		expect(matched).toEqual(["https://google.com"]);
	});
	it("matches multiple urls", () => {
		const matched = matchURLs(
			"test https://google.com test https://yahoo.com"
		);
		expect(matched).toEqual(["https://google.com", "https://yahoo.com"]);
	});
});

describe("countNumTags", () => {
	it("counts single letter tag", () => {
		const numTags = countNumTags("#t");
		expect(numTags).toEqual(1);
	});

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

	it("returns ERROR if doesn't include only a tag", () => {
		const type = findCellType("#test test", CELL_TYPE.TAG);
		expect(type).toEqual(CELL_TYPE.ERROR);
	});

	it("returns ERROR if expected doesn't match cell type", () => {
		const type = findCellType("1234", CELL_TYPE.TAG);
		expect(type).toEqual(CELL_TYPE.ERROR);
	});

	it("returns TEXT if url with tags", () => {
		const type = findCellType(
			"https://chakra-ui.com/blog/the-beginners-guide-to-building-an-accessible-web#build-a-web-thats-inclusive-of-everyone",
			CELL_TYPE.TEXT
		);
		expect(type).toEqual(CELL_TYPE.TEXT);
	});

	it("returns ERROR if url with tags", () => {
		const type = findCellType(
			"https://chakra-ui.com/blog/the-beginners-guide-to-building-an-accessible-web#build-a-web-thats-inclusive-of-everyone",
			CELL_TYPE.TAG
		);
		expect(type).toEqual(CELL_TYPE.ERROR);
	});
});
