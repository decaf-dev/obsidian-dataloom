import {
	createCheckboxFilter,
	createTestLoomState,
	createTextFilter,
} from "src/shared/loom-state/loom-state-factory";
import CommandUndoError from "./command-undo-error";
import FilterUpdateCommand from "./filter-update-command";
import { TextFilter } from "../types/loom-state";
import CommandRedoError from "./command-redo-error";

describe("filter-update-command", () => {
	it("should throw an error when undo() is called before execute()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const filter = createTextFilter(prevState.model.columns[0].id);
		prevState.model.filters.push(filter);

		const command = new FilterUpdateCommand(filter.id, {
			text: "test",
		});

		try {
			command.undo(prevState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandUndoError);
		}
	});

	it("should throw an error when redo() is called before undo()", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const filter = createTextFilter(prevState.model.columns[0].id);
		prevState.model.filters.push(filter);

		const command = new FilterUpdateCommand(filter.id, {
			text: "test",
		});

		const executeState = command.execute(prevState);

		try {
			command.redo(executeState);
		} catch (err) {
			expect(err).toBeInstanceOf(CommandRedoError);
		}
	});

	it("should partially update the filter", async () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const filter = createTextFilter(prevState.model.columns[0].id);
		prevState.model.filters.push(filter);

		const command = new FilterUpdateCommand(filter.id, {
			text: "update",
		});

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.filters.length).toEqual(1);
		expect((executeState.model.filters[0] as TextFilter).text).toEqual(
			"update"
		);
	});

	it("should fully update the filter", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const filter = createTextFilter(prevState.model.columns[0].id, {
			text: "test",
		});
		prevState.model.filters.push(filter);

		const newFilter = createCheckboxFilter(prevState.model.columns[0].id);
		const command = new FilterUpdateCommand(filter.id, newFilter, true);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.filters.length).toEqual(1);
		expect(executeState.model.filters[0]).toEqual(newFilter);
	});

	it("should undo the filter update", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const filter = createTextFilter(prevState.model.columns[0].id, {
			text: "test",
		});
		prevState.model.filters.push(filter);

		const newFilter = createCheckboxFilter(prevState.model.columns[0].id);
		const command = new FilterUpdateCommand(filter.id, newFilter, true);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.filters.length).toEqual(1);
		expect(undoState.model.filters[0]).toEqual(filter);
	});

	it("should redo the filter update", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);

		const filter = createTextFilter(prevState.model.columns[0].id, {
			text: "test",
		});
		prevState.model.filters.push(filter);

		const newFilter = createCheckboxFilter(prevState.model.columns[0].id);
		const command = new FilterUpdateCommand(filter.id, newFilter, true);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.filters.length).toEqual(1);
		expect(redoState.model.filters[0]).toEqual(newFilter);
	});
});
