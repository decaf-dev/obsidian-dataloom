import {
	createColumn,
	createGenericLoomState,
	createRow,
	createTag,
	createTagCell,
} from "src/shared/loom-state/loom-state-factory";
import TagDeleteCommand from "./tag-delete-command";
import { CellType, TagCell } from "../types/loom-state";

describe("tag-delete-command", () => {
	const generateStateWithTagColumn = () => {
		const tags = [createTag("test1"), createTag("test2")];
		const column = createColumn({ type: CellType.TAG, tags });

		const prevState = createGenericLoomState({
			columns: [column],
			rows: [
				createRow(0, {
					cells: [
						createTagCell(column.id, {
							tagId: tags[0].id,
						}),
					],
				}),
				createRow(1, {
					cells: [
						createTagCell(column.id, {
							tagId: tags[1].id,
						}),
					],
				}),
			],
		});
		return { prevState, tags };
	};

	it("should delete a tag when execute() is called", () => {
		//Arrange
		const { prevState, tags } = generateStateWithTagColumn();

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns[0].tags).toEqual([tags[1]]);
		expect((executeState.model.rows[0].cells[0] as TagCell).tagId).toEqual(
			null
		);
		expect((executeState.model.rows[1].cells[0] as TagCell).tagId).toEqual([
			tags[1].id,
		]);
	});
});
