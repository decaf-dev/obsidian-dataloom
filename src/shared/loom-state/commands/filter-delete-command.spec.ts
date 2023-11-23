import {
	createLoomState,
	createTagFilter,
	createTextFilter,
} from "../loom-state-factory";
import FilterDeleteCommand from "./filter-delete-command";

describe("filter-delete-command", () => {
	it("should delete a filter", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const { id: columnId } = prevState.model.columns[0];
		const textFilter = createTextFilter(columnId);
		const tagFilter = createTagFilter(columnId);
		prevState.model.filters.push(textFilter, tagFilter);

		const command = new FilterDeleteCommand(textFilter.id);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.filters.length).toEqual(1);
		expect(executeState.model.filters[0]).toEqual(tagFilter);
	});

	it("should add back the deleted filter when undo() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const { id: columnId } = prevState.model.columns[0];
		const textFilter = createTextFilter(columnId);
		const tagFilter = createTagFilter(columnId);
		prevState.model.filters.push(textFilter, tagFilter);

		const command = new FilterDeleteCommand(textFilter.id);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);

		//Assert
		expect(undoState.model.filters.length).toEqual(2);
		expect(undoState.model.filters).toEqual(prevState.model.filters);
	});

	it("should delete the filter when redo() is called", () => {
		//Arrange
		const prevState = createLoomState(1, 1);
		const { id: columnId } = prevState.model.columns[0];
		const textFilter = createTextFilter(columnId);
		const tagFilter = createTagFilter(columnId);
		prevState.model.filters.push(textFilter, tagFilter);

		const command = new FilterDeleteCommand(textFilter.id);

		//Act
		const executeState = command.execute(prevState);
		const undoState = command.undo(executeState);
		const redoState = command.redo(undoState);

		//Assert
		expect(redoState.model.filters.length).toEqual(1);
		expect(redoState.model.filters).toEqual(executeState.model.filters);
	});
});
