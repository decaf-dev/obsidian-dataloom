import {
	createColumn,
	createGenericLoomState,
	createRow,
	createTag,
	createTagCell,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import CommandRedoError from "./command-redo-error";
import TagDeleteCommand from "./tag-delete-command";
import { CellType, TagCell } from "../types/loom-state";

describe("tag-delete-command", () => {
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

	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
		);

		try {
			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		try {
			//Arrange
			const { prevState, tags } = createTestState();

			const command = new TagDeleteCommand(
				prevState.model.columns[0].id,
				tags[0].id
			);

			//Act
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should delete a tag when execute() is called", () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns[0].tags).toEqual([tags[1]]);
		expect((executeState.model.rows[0].cells[0] as TagCell).tagId).toEqual([
			tags[1].id,
		]);
		expect((executeState.model.rows[1].cells[0] as TagCell).tagId).toEqual([
			tags[1].id,
		]);
	});

	it("should restore the deleted tag when undo() is called", () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.rows).toEqual(prevState.model.rows);
	});

	it("should delete a tag when redo() is called", () => {
		//Arrange
		const { prevState, tags } = createTestState();

		const command = new TagDeleteCommand(
			prevState.model.columns[0].id,
			tags[0].id
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
