import {
	createColumn,
	createCustomTestLoomState,
	createRowWithCells,
	createFolderSource,
	createTag,
} from "src/shared/loom-state/loom-state-factory";
import { CellType, Column, Tag } from "src/shared/loom-state/types/loom-state";
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

	function createState(
		type: CellType,
		frontmatterKey: string | null,
		cellContent: {
			content?: string;
			dateTime?: string;
			tagIds?: string[];
		}[],
		options?: {
			tags?: Tag[];
			column?: {
				includeTime?: boolean;
			};
		}
	) {
		const { tags = [], column } = options ?? {};
		const { includeTime = false } = column ?? {};
		//Arrange
		const columns: Column[] = [
			createColumn({
				type: CellType.SOURCE,
			}),
			createColumn({
				type: CellType.SOURCE_FILE,
			}),
			createColumn({
				type,
				frontmatterKey: frontmatterKey ?? null,
				tags,
				includeTime,
			}),
		];
		const sources = [createFolderSource("test", false)];
		const rows = [
			createRowWithCells(0, columns, {
				contentForCells: [
					{
						type,
						content: "text-cell-0",
					},
				],
			}),
			createRowWithCells(1, columns, {
				sourceId: sources[0].id,
				contentForCells: [
					{
						type: CellType.SOURCE_FILE,
						content: "test1.md",
					},
					{
						type,
						content: cellContent[0]?.content,
						dateTime: cellContent[0]?.dateTime,
						tagIds: cellContent[0]?.tagIds,
					},
				],
			}),
			createRowWithCells(2, columns, {
				sourceId: sources[0].id,
				contentForCells: [
					{
						type: CellType.SOURCE_FILE,
						content: "test2.md",
					},
					{
						type,
						content: cellContent[1]?.content,
						dateTime: cellContent[1]?.dateTime,
						tagIds: cellContent[1]?.tagIds,
					},
				],
			}),
		];
		const state = createCustomTestLoomState(columns, rows, {
			sources,
		});
		return state;
	}

	it("doesn't serialize content if frontmatter key is null", async () => {
		//Arrange
		const state = createState(CellType.TEXT, null, [
			{ content: "text-cell-1" },
			{ content: "text-cell-2" },
		]);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({});
		expect(frontmatterTest2).toEqual({});
	});

	it("doesn't serialize content if frontmatter key is empty", async () => {
		//Arrange
		const state = createState(CellType.TEXT, "", [
			{ content: "text-cell-1" },
			{ content: "text-cell-2" },
		]);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({});
		expect(frontmatterTest2).toEqual({});
	});

	it("loads text cell content into frontmatter", async () => {
		//Arrange
		const state = createState(CellType.TEXT, "text", [
			{ content: "text-cell-1" },
			{ content: "text-cell-2" },
		]);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({
			text: "text-cell-1",
		});
		expect(frontmatterTest2).toEqual({
			text: "text-cell-2",
		});
	});

	it("loads date cell content into frontmatter", async () => {
		//Arrange
		const state = createState(
			CellType.DATE,
			"time",
			[
				{ dateTime: "2020-12-31T22:00:00Z" },
				{ dateTime: "2020-12-31T23:00:00Z" },
			],
			{
				column: {
					includeTime: true,
				},
			}
		);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({
			time: "2020-12-31T15:00:00",
		});
		expect(frontmatterTest2).toEqual({
			time: "2020-12-31T16:00:00",
		});
	});

	it("loads tag cell content into frontmatter", async () => {
		//Arrange
		const tags = [createTag("tag-1"), createTag("tag-2")];
		const tagIds = tags.map((tag) => tag.id);
		const state = createState(
			CellType.TAG,
			"tag",
			[{ tagIds }, { tagIds }],
			{
				tags,
			}
		);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({
			tag: "tag-1",
		});
		expect(frontmatterTest2).toEqual({
			tag: "tag-1",
		});
	});

	it("loads multi-tag cell content into frontmatter", async () => {
		//Arrange
		const tags = [createTag("tag-1"), createTag("tag-2")];
		const tagIds = tags.map((tag) => tag.id);
		const state = createState(
			CellType.MULTI_TAG,
			"tags",
			[{ tagIds }, { tagIds }],
			{
				tags,
			}
		);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({
			tags: ["tag-1", "tag-2"],
		});
		expect(frontmatterTest2).toEqual({
			tags: ["tag-1", "tag-2"],
		});
	});

	it("doesn't serialize content if the frontmatter key doesn't exist and the content is empty", async () => {
		//Arrange
		const state = createState(CellType.TEXT, "text", [
			{ content: "" },
			{ content: "" },
		]);

		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({});
		expect(frontmatterTest2).toEqual({});
	});

	it("doesn't serialize content if the frontmatter key doesn't exist and the content is empty", async () => {
		//Arrange
		const tags = [createTag("tag-1"), createTag("tag-2")];
		const state = createState(CellType.MULTI_TAG, "tags", [], { tags });
		//Act
		await serializeFrontmatter(app, state);

		//Assert
		expect(frontmatterTest1).toEqual({});
		expect(frontmatterTest2).toEqual({});
	});
});
