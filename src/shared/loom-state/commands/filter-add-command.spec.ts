import { createLoomState, createTextFilter } from "../loom-state-factory";
import FilterAddCommand from "./filter-add-command";
import { TextFilter } from "../types/loom-state";

describe("filter-add-command", () => {
	it("should add a filter to the model", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const filter = createTextFilter(prevState.model.columns[0].id, {
			text: "before",
		});
		prevState.model.filters.push(filter);
		const command = new FilterAddCommand();

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.filters.length).toEqual(2);
		expect((executeState.model.filters[1] as TextFilter).text).toEqual("");
	});

	it("should remove the added filter when undo() is called", () => {
		const prevState = createLoomState(1, 1);
		const filter = createTextFilter(prevState.model.columns[0].id);
		prevState.model.filters.push(filter);

		const command = new FilterAddCommand();

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.filters.length).toEqual(1);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should add back the removed filter when redo() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const filter = createTextFilter(prevState.model.columns[0].id);
		prevState.model.filters.push(filter);

		const command = new FilterAddCommand();

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.filters.length).toEqual(2);
		expect(redoState.model.filters).toEqual(executeState.model.filters);
	});
});
