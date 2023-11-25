import {
	createCheckboxFilter,
	createLoomState,
	createTextFilter,
} from "src/shared/loom-state/loom-state-factory";
import FilterUpdateCommand from "./filter-update-command";
import { TextFilter } from "../types/loom-state";

describe("filter-update-command", () => {
	it("should partially update the filter", async () => {
		//Arrange
		const prevState = createLoomState(1, 1);

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
		const prevState = createLoomState(1, 1);

		const filter = createTextFilter(prevState.model.columns[0].id, {
			text: "fully",
		});
		prevState.model.filters.push(filter);

		const newFilter = createCheckboxFilter(prevState.model.columns[0].id);
		const command = new FilterUpdateCommand(filter.id, newFilter, true);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.filters.length).toEqual(1);
		expect((executeState.model.filters[0] as TextFilter).text).toEqual(
			"fully"
		);
	});
});
