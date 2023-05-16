import {
	createFilterRule,
	createTableState,
	createTag,
} from "src/data/table-state-factory";
import RowDeleteCommand from "./row-delete-command";
import {
	DeleteCommandArgumentsError,
	CommandUndoError,
} from "./command-errors";
import ColumnDeleteCommand from "./column-delete-command";

describe("column-delete-command", () => {
	it("should throw an error if no arguments are passed to the command object", () => {
		try {
			new ColumnDeleteCommand({});
		} catch (err) {
			expect(err).toBeInstanceOf(DeleteCommandArgumentsError);
		}
	});

	it("should throw an error when undo() is called before execute()", () => {
		try {
			const prevState = createTableState(2, 1);
			const command = new ColumnDeleteCommand({
				last: true,
			});
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should return the same state when only 1 column is in the table", () => {
		//Setup
		const prevState = createTableState(1, 1);

		const tags = [
			createTag(prevState.model.columns[0].id, "test1"),
			createTag(prevState.model.columns[0].id, "test2"),
		];
		prevState.model.tags = tags;

		const filterRules = [
			createFilterRule(prevState.model.columns[0].id),
			createFilterRule(prevState.model.columns[0].id),
		];
		prevState.model.filterRules = filterRules;

		//Mutate
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
		expect(executeState.model.tags).toEqual(prevState.model.tags);
		expect(executeState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should delete a column when execute() is called", () => {
		//Setup
		const prevState = createTableState(2, 1);

		const tags = [
			createTag(prevState.model.columns[0].id, "test1"),
			createTag(prevState.model.columns[0].id, "test2"),
		];
		prevState.model.tags = tags;

		const filterRules = [
			createFilterRule(prevState.model.columns[0].id),
			createFilterRule(prevState.model.columns[0].id),
		];
		prevState.model.filterRules = filterRules;

		//Mutate
		const executeState = new ColumnDeleteCommand({
			id: prevState.model.columns[0].id,
		}).execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.headerCells.length).toEqual(1);
		expect(executeState.model.bodyCells.length).toEqual(1);
		expect(executeState.model.footerCells.length).toEqual(2);
		expect(executeState.model.tags.length).toEqual(0);
		expect(executeState.model.filterRules.length).toEqual(0);
	});

	it("should delete the last column when execute() is called", () => {
		//Setup
		const prevState = createTableState(2, 1);

		const tags = [
			createTag(prevState.model.columns[1].id, "test1"),
			createTag(prevState.model.columns[1].id, "test2"),
		];
		prevState.model.tags = tags;

		const filterRules = [
			createFilterRule(prevState.model.columns[1].id),
			createFilterRule(prevState.model.columns[1].id),
		];
		prevState.model.filterRules = filterRules;

		//Mutate
		const executeState = new ColumnDeleteCommand({
			last: true,
		}).execute(prevState);

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
		expect(executeState.model.tags).toEqual(
			prevState.model.tags.filter(
				(tag) => tag.columnId !== prevState.model.columns[1].id
			)
		);
		expect(executeState.model.filterRules).toEqual(
			prevState.model.filterRules.filter(
				(rule) => rule.columnId !== prevState.model.columns[1].id
			)
		);
	});

	it("should restore the deleted column when undo() is called", () => {
		//Setup
		const prevState = createTableState(2, 1);

		const tags = [
			createTag(prevState.model.columns[0].id, "test1"),
			createTag(prevState.model.columns[0].id, "test2"),
		];
		prevState.model.tags = tags;

		const filterRules = [
			createFilterRule(prevState.model.columns[0].id),
			createFilterRule(prevState.model.columns[0].id),
		];
		prevState.model.filterRules = filterRules;

		const command = new ColumnDeleteCommand({
			id: prevState.model.columns[0].id,
		});

		//Mutate
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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});

	it("should restore the last deleted column when undo() is called", () => {
		//Setup
		const prevState = createTableState(2, 1);

		const tags = [
			createTag(prevState.model.columns[1].id, "test1"),
			createTag(prevState.model.columns[1].id, "test2"),
		];
		prevState.model.tags = tags;

		const filterRules = [
			createFilterRule(prevState.model.columns[1].id),
			createFilterRule(prevState.model.columns[1].id),
		];
		prevState.model.filterRules = filterRules;

		const command = new RowDeleteCommand({
			last: true,
		});

		//Mutate
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
		expect(undoState.model.tags).toEqual(prevState.model.tags);
		expect(undoState.model.filterRules).toEqual(
			prevState.model.filterRules
		);
	});
});
