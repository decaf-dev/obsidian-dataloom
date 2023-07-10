import { createTableState } from "src/data/table-state-factory";
import { CommandRedoError, CommandUndoError } from "./command-errors";
import ColumnUpdateCommand from "./column-update-command";

describe("column-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		try {
			//Arrange
			const prevState = createTableState(1, 1);
			const command = new ColumnUpdateCommand(
				prevState.model.columns[0].id,
				"width",
				{ value: "250px" }
			);

			//Act
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before redo()", () => {
		try {
			//Arrange
			const prevState = createTableState(1, 1);
			const command = new ColumnUpdateCommand(
				prevState.model.columns[0].id,
				"width",
				{ value: "250px" }
			);

			//Act
			command.execute(prevState);
			command.redo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should update a column property when execute() is called", async () => {
		//Arrange
		const prevState = createTableState(1, 1);
		const command = new ColumnUpdateCommand(
			prevState.model.columns[0].id,
			"width",
			{ value: "250px" }
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].width).toEqual("250px");
	});

	it("should reset the cell property when undo() is called", () => {
		//Arrange
		const prevState = createTableState(1, 1);
		const command = new ColumnUpdateCommand(
			prevState.model.columns[0].id,
			"width",
			{ value: "250px" }
		);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
	});
});
