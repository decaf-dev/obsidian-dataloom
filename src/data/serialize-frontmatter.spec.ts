import {
	createColumn,
	createDateCell,
	createFolderSource,
	createGenericLoomState,
	createMultiTagCell,
	createRow,
	createSourceCell,
	createSourceFileCell,
	createTag,
	createTagCell,
	createTextCell,
} from "src/shared/loom-state/loom-state-factory";
import {
	CellType,
	Column,
	Row,
	Source,
} from "src/shared/loom-state/types/loom-state";
import { serializeFrontmatter } from "./serialize-frontmatter";
import { App, TFile } from "obsidian";

describe("serializeFrontmatter", () => {
	let frontmatterTest1 = {};
	let frontmatterTest2 = {};

	const app = {
		vault: {
			getAbstractFileByPath: (path: string) => {
				const file = new TFile();
				file.path = path;
				return file;
			},
		},
		fileManager: {
			processFrontMatter: async (
				file: TFile,
				callback: (frontmatter: any) => void
			) => {
				if (file.path === "test1.md") {
					callback(frontmatterTest1);
				} else if (file.path === "test2.md") {
					callback(frontmatterTest2);
				}
			},
		},
	} as unknown as App;

	afterEach(() => {
		frontmatterTest1 = {};
		frontmatterTest2 = {};
	});

	/**
	 * Returns a 3x2 state with a source column, source file column, and text column
	 * @param frontmatterKey - The frontmatter key to use in the text column
	 * @param textCellContent - The content of the text cells
	 */
	const generateStateWithTextColumn = (
		frontmatterKey: string | null,
		textCellContent: string[]
	) => {
		//Arrange
		const columns: Column[] = [
			createColumn({ type: CellType.SOURCE }),
			createColumn({ type: CellType.SOURCE_FILE }),
			createColumn({ frontmatterKey }),
		];
		const sources: Source[] = [createFolderSource("test", false)];

		const rows: Row[] = [
			createRow(0, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id, {
						path: "test1.md",
					}),
					createTextCell(columns[2].id, {
						content: textCellContent[0],
					}),
				],
			}),
			createRow(1, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id, {
						path: "test2.md",
					}),
					createTextCell(columns[2].id, {
						content: textCellContent[1],
					}),
				],
			}),
		];
		const state = createGenericLoomState({ columns, rows, sources });
		return state;
	};

	/**
	 * Returns a 3x2 state with a source column, source file column, and date column
	 * - date cell 0 - "2020-12-31T22:00:00Z"
	 * - date cell 1 - "2020-12-31T23:00:00Z"
	 * @param frontmatterKey - The frontmatter key to use in the date column
	 */
	const generateStateWithDateColumn = (frontmatterKey: string | null) => {
		//Arrange
		const columns: Column[] = [
			createColumn({ type: CellType.SOURCE }),
			createColumn({ type: CellType.SOURCE_FILE }),
			createColumn({
				type: CellType.DATE,
				includeTime: true,
				frontmatterKey,
			}),
		];
		const sources: Source[] = [createFolderSource("test", false)];

		const rows: Row[] = [
			createRow(0, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id),
					createDateCell(columns[2].id, {
						dateTime: "2020-12-31T22:00:00Z",
					}),
				],
			}),
			createRow(1, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id),
					createDateCell(columns[2].id, {
						dateTime: "2020-12-31T23:00:00Z",
					}),
				],
			}),
		];
		const state = createGenericLoomState({ columns, rows, sources });
		return state;
	};

	/**
	 * Returns a 3x2 state with a source column, source file column, and tag column
	 * - tag cell 0 - "tag1"
	 * - tag cell 1 - "tag2"
	 * @param frontmatterKey - The frontmatter key to use in the tag column
	 */
	const generateStateWithTagColumn = (frontmatterKey: string | null) => {
		//Arrange
		//Arrange
		const columns: Column[] = [
			createColumn({ type: CellType.SOURCE }),
			createColumn({ type: CellType.SOURCE_FILE }),
			createColumn({
				type: CellType.TAG,
				tags: [createTag("tag1"), createTag("tag2")],
				frontmatterKey,
			}),
		];
		const sources: Source[] = [createFolderSource("test", false)];

		const rows: Row[] = [
			createRow(0, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id, {
						path: "test1.md",
					}),
					createTagCell(columns[2].id, {
						tagId: columns[2].tags[0].id,
					}),
				],
			}),
			createRow(1, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id, {
						path: "test2.md",
					}),
					createTagCell(columns[2].id, {
						tagId: columns[2].tags[0].id,
					}),
				],
			}),
		];
		const state = createGenericLoomState({ columns, rows, sources });
		return state;
	};

	/**
	 * Returns a 3x2 state with a source column, source file column, and multi-tag column
	 * - multi tag cell 0 - "tag1"
	 * - multi tag cell 1 - "tag2"
	 * @param frontmatterKey - The frontmatter key to use in the multi-tag column
	 */
	const generateStateWithMultiTagColumn = (frontmatterKey: string | null) => {
		//Arrange
		//Arrange
		const columns: Column[] = [
			createColumn({ type: CellType.SOURCE }),
			createColumn({ type: CellType.SOURCE_FILE }),
			createColumn({
				type: CellType.MULTI_TAG,
				tags: [createTag("tag1"), createTag("tag2")],
				frontmatterKey,
			}),
		];
		const sources: Source[] = [createFolderSource("test", false)];

		const rows: Row[] = [
			createRow(0, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id, {
						path: "test1.md",
					}),
					createMultiTagCell(columns[2].id, {
						tagIds: [columns[2].tags[0].id, columns[2].tags[1].id],
					}),
				],
			}),
			createRow(1, {
				sourceId: sources[0].id,
				cells: [
					createSourceCell(columns[0].id),
					createSourceFileCell(columns[1].id, {
						path: "test2.md",
					}),
					createMultiTagCell(columns[2].id, {
						tagIds: [columns[2].tags[0].id, columns[2].tags[1].id],
					}),
				],
			}),
		];
		const state = createGenericLoomState({ columns, rows, sources });
		return state;
	};

	it("doesn't serialize content if frontmatter key is null", async () => {
		//Arrange
		const state = generateStateWithTextColumn(null, [
			"text-cell-0",
			"text-cell-1",
		]);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({});
		expect(frontmatterTest2).toEqual({});
	});

	it("doesn't serialize content if frontmatter key is empty", async () => {
		//Arrange
		const state = generateStateWithTextColumn("", [
			"text-cell-0",
			"text-cell-1",
		]);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({});
		expect(frontmatterTest2).toEqual({});
	});

	it("loads text cell content into frontmatter", async () => {
		//Arrange
		const state = generateStateWithTextColumn("text", [
			"text-cell-0",
			"text-cell-1",
		]);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({
			text: "text-cell-0",
		});
		expect(frontmatterTest2).toEqual({
			text: "text-cell-1",
		});
	});

	//TODO mock updateObsidianPropertyType
	// it("loads date cell content into frontmatter", async () => {
	// 	//Arrange
	// 	const state = generateStateWithDateColumn("time");

	// 	//Act
	// 	await serializeFrontmatter(app, state);

	// 	//Assert
	// 	expect(frontmatterTest1).toEqual({
	// 		time: "2020-12-31T15:00:00",
	// 	});
	// 	expect(frontmatterTest2).toEqual({
	// 		time: "2020-12-31T16:00:00",
	// 	});
	// });

	it("loads tag cell content into frontmatter", async () => {
		//Arrange
		const state = generateStateWithTagColumn("tag");

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({
			tag: "tag1",
		});
		expect(frontmatterTest2).toEqual({
			tag: "tag1",
		});
	});

	it("loads multi-tag cell content into frontmatter", async () => {
		//Arrange
		const state = generateStateWithMultiTagColumn("tags");

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({
			tags: ["tag1", "tag2"],
		});
		expect(frontmatterTest2).toEqual({
			tags: ["tag1", "tag2"],
		});
	});

	it("doesn't serialize content if the frontmatter key doesn't exist and the content is empty", async () => {
		//Arrange
		const state = generateStateWithTextColumn("text", ["", ""]);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({});
		expect(frontmatterTest2).toEqual({});
	});
});
