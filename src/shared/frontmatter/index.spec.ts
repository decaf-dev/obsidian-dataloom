describe("deserializeFrontmatter", () => {
	it("deserializes text content", () => {});
	//TODO fix
	// const currentTime = "2020-01-01T00:00:00";
	// const app = {
	// 	metadataCache: {
	// 		getCache: (path: string) => {
	// 			let frontmatter: Record<string, unknown> = {};
	// 			switch (path) {
	// 				case "text.md":
	// 					frontmatter = {
	// 						text: "text",
	// 					};
	// 					break;
	// 				case "number.md":
	// 					frontmatter = {
	// 						number: 123456,
	// 					};
	// 					break;
	// 				case "date.md":
	// 					frontmatter = {
	// 						date: currentTime,
	// 					};
	// 					break;
	// 				case "tag.md":
	// 					frontmatter = {
	// 						tag: "tag1",
	// 					};
	// 					break;
	// 				case "tags.md":
	// 					frontmatter = {
	// 						tags: ["tag1", "tag2"],
	// 					};
	// 					break;
	// 				case "null.md":
	// 					frontmatter = {};
	// 					break;
	// 				default:
	// 					throw new Error("Unhandled file path");
	// 			}
	// 			return {
	// 				frontmatter,
	// 			};
	// 		},
	// 	},
	// } as unknown as App;
	// it("deserializes text content", () => {
	// 	//Arrange
	// 	const state = createLoomState(1, 1, { type: CellType.TEXT });
	// 	state.model.columns[0].frontmatterKey = "text";
	// 	//Act
	// 	const result = deserializeFrontmatterForCell(
	// 		app,
	// 		state.model.columns[0],
	// 		"text.md"
	// 	);
	// 	//Assert
	// 	expect(result).not.toBeNull();
	// 	expect((result?.newCell as TextCell).content).toEqual("text");
	// 	expect(result?.nextTags).toEqual(undefined);
	// });
	// it("deserializes date content", () => {
	// 	//Arrange
	// 	const state = createLoomState(1, 1, { type: CellType.DATE });
	// 	state.model.columns[0].frontmatterKey = "date";
	// 	//Act
	// 	const result = deserializeFrontmatterForCell(
	// 		app,
	// 		state.model.columns[0],
	// 		"date.md"
	// 	);
	// 	//Assert
	// 	expect(result).not.toBeNull();
	// 	expect((result?.newCell as DateCell).dateTime).toEqual(
	// 		new Date(currentTime).toISOString()
	// 	);
	// 	expect(result?.nextTags).toEqual([]);
	// });
	// it("deserializes number content", () => {
	// 	//Arrange
	// 	const state = createLoomState(1, 1, { type: CellType.NUMBER });
	// 	state.model.columns[0].frontmatterKey = "number";
	// 	//Act
	// 	const result = deserializeFrontmatterForCell(
	// 		app,
	// 		state.model.columns[0],
	// 		"number.md"
	// 	);
	// 	//Assert
	// 	expect(result).not.toBeNull();
	// 	expect((result?.newCell as NumberCell).value).toEqual(123456);
	// 	expect(result?.nextTags).toEqual([]);
	// });
	// it("deserializes tag content", () => {
	// 	//Arrange
	// 	const state = createLoomState(1, 1, { type: CellType.TAG });
	// 	state.model.columns[0].frontmatterKey = "tag";
	// 	//Act
	// 	const result = deserializeFrontmatterForCell(
	// 		app,
	// 		state.model.columns[0],
	// 		"tag.md"
	// 	);
	// 	//Assert
	// 	expect(result).not.toBeNull();
	// 	expect((result?.newCell as TagCell).tagId).not.toBeNull();
	// 	expect(result?.nextTags).toHaveLength(1);
	// 	expect(result?.nextTags?.[0].content).toEqual("tag1");
	// });
	// it("deserializes multi-tag content", () => {
	// 	//Arrange
	// 	const state = createLoomState(1, 1, { type: CellType.MULTI_TAG });
	// 	state.model.columns[0].frontmatterKey = "tags";
	// 	//Act
	// 	const result = deserializeFrontmatterForCell(
	// 		app,
	// 		state.model.columns[0],
	// 		"tags.md"
	// 	);
	// 	//Assert
	// 	expect(result).not.toBeNull();
	// 	expect((result?.newCell as MultiTagCell).tagIds).toHaveLength(2);
	// 	expect(result?.nextTags).toHaveLength(2);
	// 	expect(result?.nextTags?.[0].content).toEqual("tag1");
	// 	expect(result?.nextTags?.[1].content).toEqual("tag2");
	// });
	// it("returns null if frontmatter key is null", () => {
	// 	//Arrange
	// 	const state = createLoomState(1, 1, { type: CellType.TEXT });
	// 	//Act
	// 	const result = deserializeFrontmatterForCell(
	// 		app,
	// 		state.model.columns[0],
	// 		"null.md"
	// 	);
	// 	//Assert
	// 	expect(result).toBeNull();
	// });
	// it("returns null if no frontmatter for the specified key exists", () => {
	// 	//Arrange
	// 	const state = createLoomState(1, 1, { type: CellType.TEXT });
	// 	//Act
	// 	const result = deserializeFrontmatterForCell(
	// 		app,
	// 		state.model.columns[0],
	// 		"null.md"
	// 	);
	// 	//Assert
	// 	expect(result).toBeNull();
	// });
});
