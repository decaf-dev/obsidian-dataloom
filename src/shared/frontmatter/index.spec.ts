import { App } from "obsidian";
import { deserializeFrontmatterForCell } from ".";
import { createTestLoomState } from "../loom-state/loom-state-factory";
import { CellType } from "../loom-state/types/loom-state";

describe("deserializeFrontmatter", () => {
	const currentTime = "2020-01-01T00:00:00";
	const app = {
		metadataCache: {
			getCache: (path: string) => {
				let frontmatter: Record<string, unknown> = {};
				switch (path) {
					case "text.md":
						frontmatter = {
							text: "text",
						};
						break;
					case "number.md":
						frontmatter = {
							number: 123456,
						};
						break;
					case "date.md":
						frontmatter = {
							date: currentTime,
						};
						break;
					case "tag.md":
						frontmatter = {
							tag: "tag1",
						};
						break;
					case "tags.md":
						frontmatter = {
							tags: ["tag1", "tag2"],
						};
						break;
					case "null.md":
						frontmatter = {};
						break;
					default:
						throw new Error("Unhandled file path");
				}

				return {
					frontmatter,
				};
			},
		},
	} as unknown as App;

	it("deserializes text content", () => {
		//Arrange
		const state = createTestLoomState(1, 1, { type: CellType.TEXT });
		state.model.columns[0].frontmatterKey = {
			key: "text",
			isCustom: false,
			customType: null,
		};

		//Act
		const result = deserializeFrontmatterForCell(
			app,
			state.model.columns[0],
			"text.md"
		);

		//Assert
		expect(result).not.toBeNull();
		expect(result?.newCell.content).toEqual("text");
		expect(result?.nextTags).toEqual(undefined);
	});

	it("deserializes number content", () => {
		//Arrange
		const state = createTestLoomState(1, 1, { type: CellType.DATE });
		state.model.columns[0].frontmatterKey = {
			key: "date",
			isCustom: false,
			customType: null,
		};

		//Act
		const result = deserializeFrontmatterForCell(
			app,
			state.model.columns[0],
			"date.md"
		);

		//Assert
		expect(result).not.toBeNull();
		expect(result?.newCell.content).toEqual("");
		expect(result?.newCell.dateTime).toEqual(
			new Date(currentTime).toISOString()
		);
		expect(result?.nextTags).toEqual([]);
	});

	it("deserializes date content", () => {
		//Arrange
		const state = createTestLoomState(1, 1, { type: CellType.NUMBER });
		state.model.columns[0].frontmatterKey = {
			key: "date",
			isCustom: false,
			customType: null,
		};

		//Act
		const result = deserializeFrontmatterForCell(
			app,
			state.model.columns[0],
			"date.md"
		);

		//Assert
		expect(result).not.toBeNull();
		expect(result?.newCell.content).toEqual(currentTime);
		expect(result?.nextTags).toEqual([]);
	});

	it("deserializes tag content", () => {
		//Arrange
		const state = createTestLoomState(1, 1, { type: CellType.TAG });
		state.model.columns[0].frontmatterKey = {
			key: "tag",
			isCustom: false,
			customType: null,
		};

		//Act
		const result = deserializeFrontmatterForCell(
			app,
			state.model.columns[0],
			"tag.md"
		);

		//Assert
		expect(result).not.toBeNull();
		expect(result?.newCell.content).toEqual("");
		expect(result?.nextTags).toHaveLength(1);
		expect(result?.nextTags?.[0].content).toEqual("tag1");
	});

	it("deserializes multi-tag content", () => {
		//Arrange
		const state = createTestLoomState(1, 1, { type: CellType.MULTI_TAG });
		state.model.columns[0].frontmatterKey = {
			key: "tags",
			isCustom: false,
			customType: null,
		};

		//Act
		const result = deserializeFrontmatterForCell(
			app,
			state.model.columns[0],
			"tags.md"
		);

		//Assert
		expect(result).not.toBeNull();
		expect(result?.newCell.content).toEqual("");
		expect(result?.nextTags).toHaveLength(2);
		expect(result?.nextTags?.[0].content).toEqual("tag1");
		expect(result?.nextTags?.[1].content).toEqual("tag2");
	});

	it("returns null if frontmatter key is null", () => {
		//Arrange
		const state = createTestLoomState(1, 1, { type: CellType.TEXT });

		//Act
		const result = deserializeFrontmatterForCell(
			app,
			state.model.columns[0],
			"null.md"
		);

		//Assert
		expect(result).toBeNull();
	});

	it("returns null if no frontmatter for the specified key exists", () => {
		//Arrange
		const state = createTestLoomState(1, 1, { type: CellType.TEXT });

		//Act
		const result = deserializeFrontmatterForCell(
			app,
			state.model.columns[0],
			"null.md"
		);

		//Assert
		expect(result).toBeNull();
	});
});
