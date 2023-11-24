import {
	createColumn,
	createGenericLoomState,
	createRow,
	createTag,
	createTagCell,
} from "src/shared/loom-state/loom-state-factory";
import TagUpdateCommand from "./tag-update-command";
import { CellType } from "../types/loom-state";

describe("tag-update-command", () => {
	const createTestState = () => {
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

	it("should update a tag property when execute() is called", async () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagUpdateCommand(
			prevState.model.columns[0].id,
			tags[0].id,
			{
				content: "",
			}
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(executeState.model.columns[0].tags[0].content).toEqual("");
		expect(executeState.model.columns[0].tags[1].content).toEqual("test2");
		expect(executeState.model.rows).toEqual(prevState.model.rows);
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagUpdateCommand(
			prevState.model.columns[0].id,
			tags[0].id,
			{
				content: "",
			}
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(executeState.model.rows).toEqual(prevState.model.rows);
	});

	it("should update a tag property when redo() is called", async () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagUpdateCommand(
			prevState.model.columns[0].id,
			tags[0].id,
			{
				content: "",
			}
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(executeState.model.columns).toEqual(redoState.model.columns);
		expect(executeState.model.rows).toEqual(redoState.model.rows);
	});
});
