import {
	createTextFilter,
	createTestLoomState,
} from "src/shared/loom-state/loom-state-factory";
import RowDeleteCommand from "./row-delete-command";
import CommandUndoError from "./command-undo-error";
import ColumnDeleteCommand from "./column-delete-command";
import CommandArgumentsError from "./command-arguments-error";

describe("column-delete-command", () => {
	it("should throw an error if no arguments are passed to the command object", () => {
		try {
			new ColumnDeleteCommand({});
		} catch (err) {
			expect(err).toBeInstanceOf(CommandArgumentsError);
		}
	});

	it("should throw an error when undo() is called before execute()", () => {
		const prevState = createTestLoomState(2, 1);
		const command = new ColumnDeleteCommand({
			last: true,
		});

		try {
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should return the same state when only 1 column is in the table", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const filters = [
			createTextFilter(prevState.model.columns[0].id),
			createTextFilter(prevState.model.columns[0].id),
		];
		prevState.model.filters = filters;

		//Act
		const executeState = new ColumnDeleteCommand({
			id: prevState.model.columns[0].id,
		}).execute(prevState);

		//Assert
		expect(executeState.model.columns).toEqual(prevState.model.columns);
		expect(executeState.model.headerCells).toEqual(
			prevState.model.headerCells
		);

		expect(executeState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(executeState.model.footerCells).toEqual(
			prevState.model.footerCells
		);
		expect(executeState.model.filters).toEqual(prevState.model.filters);
	});

	it("should delete a column when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(2, 1);

		const filters = [
			createTextFilter(prevState.model.columns[0].id),
			createTextFilter(prevState.model.columns[0].id),
		];
		prevState.model.filters = filters;
		const command = new ColumnDeleteCommand({
			id: prevState.model.columns[0].id,
		});

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.headerCells.length).toEqual(1);
		expect(executeState.model.bodyCells.length).toEqual(1);
		expect(executeState.model.footerCells.length).toEqual(2);
		expect(executeState.model.filters.length).toEqual(0);
	});

	it("should delete the last column when execute() is called", () => {
		//Arrange
		const prevState = createTestLoomState(2, 1);

		const filters = [
			createTextFilter(prevState.model.columns[1].id),
			createTextFilter(prevState.model.columns[1].id),
		];
		prevState.model.filters = filters;
		const command = new ColumnDeleteCommand({
			last: true,
		});

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns[0].id).toEqual(
			prevState.model.columns[0].id
		);
		expect(executeState.model.headerCells).toEqual([
			prevState.model.headerCells[0],
			prevState.model.headerCells[2],
		]);
		expect(executeState.model.bodyCells).toEqual([
			prevState.model.bodyCells[0],
			prevState.model.bodyCells[2],
		]);
		expect(executeState.model.footerCells).toEqual([
			prevState.model.footerCells[0],
			prevState.model.footerCells[2],
		]);
		expect(executeState.model.filters).toEqual(
			prevState.model.filters.filter(
				(filter) => filter.columnId !== prevState.model.columns[1].id
			)
		);
	});

	it("should restore the deleted column when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(2, 1);

		const filters = [
			createTextFilter(prevState.model.columns[0].id),
			createTextFilter(prevState.model.columns[0].id),
		];
		prevState.model.filters = filters;

		const command = new ColumnDeleteCommand({
			id: prevState.model.columns[0].id,
		});

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.headerCells).toEqual(
			prevState.model.headerCells
		);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.footerCells).toEqual(
			prevState.model.footerCells
		);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should restore the last deleted column when undo() is called", () => {
		//Arrange
		const prevState = createTestLoomState(2, 1);

		const filters = [
			createTextFilter(prevState.model.columns[1].id),
			createTextFilter(prevState.model.columns[1].id),
		];
		prevState.model.filters = filters;

		const command = new RowDeleteCommand({
			last: true,
		});

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.columns).toEqual(prevState.model.columns);
		expect(undoState.model.headerCells).toEqual(
			prevState.model.headerCells
		);
		expect(undoState.model.bodyCells).toEqual(prevState.model.bodyCells);
		expect(undoState.model.footerCells).toEqual(
			prevState.model.footerCells
		);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});
});
