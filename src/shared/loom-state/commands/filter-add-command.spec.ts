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
});
