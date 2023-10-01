// import {
// 	createTextFilter,
// 	createTestLoomState,
// 	createSource,
// 	createColumn,
// 	createRow,
// 	createCell,
// } from "src/shared/loom-state/state-factory";
// import SourceDeleteCommand from "./source-delete-command";
// import { CellType, SourceType } from "../types/loom-state";
// import CommandUndoError from "./command-undo-error";
// import CommandRedoError from "./command-redo-error";

// describe("column-delete-command", () => {
// 	it("should throw an error when undo() is called before execute()", () => {
// 		const prevState = createTestLoomState(1, 1);
// 		const source = createSource(SourceType.FOLDER, "test");
// 		prevState.model.sources = [source];

// 		const columns = [
// 			createColumn({ cellType: CellType.SOURCE }),
// 			createColumn({ cellType: CellType.SOURCE_FILE }),
// 		];
// 		prevState.model.columns = [...columns, ...prevState.model.columns];

// 		const cells = columns.map((column, i) => {
// 			const { id, type } = column;
// 			const cell = createCell(id, {
// 				cellType: type,
// 				content: `test-${i}`,
// 			});
// 			return cell;
// 		});
// 		const row = createRow(0, {
// 			sourceId: source.id,
// 			cells,
// 		});
// 		prevState.model.rows[0] = row;

// 		const command = new SourceDeleteCommand(source.id);

// 		try {
// 			command.undo(prevState);
// 		} catch (err) {
// 			expect(err).toBeInstanceOf(CommandUndoError);
// 		}
// 	});

// 	it("throws an error when redo() is called before undo()", () => {
// 		const prevState = createTestLoomState(1, 1);
// 		const source = createSource(SourceType.FOLDER, "test");
// 		prevState.model.sources = [source];

// 		const columns = [
// 			createColumn({ cellType: CellType.SOURCE }),
// 			createColumn({ cellType: CellType.SOURCE_FILE }),
// 		];
// 		prevState.model.columns = [...columns, ...prevState.model.columns];

// 		const cells = columns.map((column, i) => {
// 			const { id, type } = column;
// 			const cell = createCell(id, {
// 				cellType: type,
// 				content: `test-${i}`,
// 			});
// 			return cell;
// 		});
// 		const row = createRow(0, {
// 			sourceId: source.id,
// 			cells,
// 		});
// 		prevState.model.rows[0] = row;

// 		const command = new SourceDeleteCommand(source.id);

// 		try {
// 			const executeState = command.execute(prevState);
// 			command.redo(executeState);
// 		} catch (err) {
// 			expect(err).toBeInstanceOf(CommandRedoError);
// 		}
// 	});

// 	it("deletes a source and its corresponding rows", () => {
// 		//Arrange
// 		const prevState = createTestLoomState(1, 1);
// 		const source = createSource(SourceType.FOLDER, "test");
// 		prevState.model.sources = [source];

// 		const columns = [
// 			createColumn({ cellType: CellType.SOURCE }),
// 			createColumn({ cellType: CellType.SOURCE_FILE }),
// 		];
// 		prevState.model.columns = [...columns, ...prevState.model.columns];

// 		const cells = columns.map((column, i) => {
// 			const { id, type } = column;
// 			const cell = createCell(id, {
// 				cellType: type,
// 				content: `test-${i}`,
// 			});
// 			return cell;
// 		});
// 		const row = createRow(0, {
// 			sourceId: source.id,
// 			cells,
// 		});
// 		prevState.model.rows[0] = row;

// 		const command = new SourceDeleteCommand(source.id);
// 	});

// 	it("should delete a column when execute() is called", () => {
// 		//Arrange
// 		const prevState = createTestLoomState(2, 1);

// 		const filters = [
// 			createTextFilter(prevState.model.columns[0].id),
// 			createTextFilter(prevState.model.columns[0].id),
// 		];
// 		prevState.model.filters = filters;
// 		const command = new ColumnDeleteCommand({
// 			id: prevState.model.columns[0].id,
// 		});

// 		//Act
// 		const executeState = command.execute(prevState);

// 		//Assert
// 		expect(executeState.model.columns.length).toEqual(1);
// 		expect(executeState.model.filters.length).toEqual(0);
// 	});

// 	it("should delete the last column when execute() is called", () => {
// 		//Arrange
// 		const prevState = createTestLoomState(2, 1);

// 		const filters = [
// 			createTextFilter(prevState.model.columns[1].id),
// 			createTextFilter(prevState.model.columns[1].id),
// 		];
// 		prevState.model.filters = filters;
// 		const command = new ColumnDeleteCommand({
// 			last: true,
// 		});

// 		//Act
// 		const executeState = command.execute(prevState);

// 		//Assert
// 		expect(executeState.model.columns[0].id).toEqual(
// 			prevState.model.columns[0].id
// 		);
// 		expect(executeState.model.rows[0].cells[0]).toEqual(
// 			prevState.model.rows[0].cells[0]
// 		);
// 		expect(executeState.model.filters).toEqual(
// 			prevState.model.filters.filter(
// 				(filter) => filter.columnId !== prevState.model.columns[1].id
// 			)
// 		);
// 	});

// 	it("should restore the deleted column when undo() is called", () => {
// 		//Arrange
// 		const prevState = createTestLoomState(2, 1);

// 		const filters = [
// 			createTextFilter(prevState.model.columns[0].id),
// 			createTextFilter(prevState.model.columns[0].id),
// 		];
// 		prevState.model.filters = filters;

// 		const command = new ColumnDeleteCommand({
// 			id: prevState.model.columns[0].id,
// 		});

// 		//Act
// 		const executeState = command.execute(prevState);
// 		const undoState = command.undo(executeState);

// 		//Assert
// 		expect(undoState.model.columns).toEqual(prevState.model.columns);
// 		expect(undoState.model.rows).toEqual(prevState.model.rows);
// 		expect(undoState.model.filters).toEqual(prevState.model.filters);
// 	});

// 	it("should restore the last deleted column when undo() is called", () => {
// 		//Arrange
// 		const prevState = createTestLoomState(2, 1);

// 		const filters = [
// 			createTextFilter(prevState.model.columns[1].id),
// 			createTextFilter(prevState.model.columns[1].id),
// 		];
// 		prevState.model.filters = filters;

// 		const command = new RowDeleteCommand({
// 			last: true,
// 		});

// 		//Act
// 		const executeState = command.execute(prevState);
// 		const undoState = command.undo(executeState);

// 		//Assert
// 		expect(undoState.model.columns).toEqual(prevState.model.columns);
// 		expect(undoState.model.rows).toEqual(prevState.model.rows);
// 		expect(undoState.model.filters).toEqual(prevState.model.filters);
// 	});
// });
