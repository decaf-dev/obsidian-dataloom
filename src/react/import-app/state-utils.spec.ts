import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import { ColumnMatch, ImportData } from "./types";
import { updateStateWithImportData } from "./state-utils";
import { NEW_COLUMN_ID } from "./constants";

describe("updateStateWithImportData", () => {
	it("imports data into a table of the same size", () => {
		//Arrange
		const prevState = createTestLoomState(2, 2);
		prevState.model.bodyCells[0].markdown = "data 1";
		prevState.model.bodyCells[1].markdown = "data 2";
		prevState.model.bodyCells[2].markdown = "data 3";
		prevState.model.bodyCells[3].markdown = "data 4";

		const data: ImportData = [
			["header 1", "header 2"],
			["import 1", "import 2"],
			["import 3", "import 4"],
		];

		const columnMatches: ColumnMatch[] = [
			{ importColumnIndex: 0, columnId: prevState.model.columns[0].id },
			{ importColumnIndex: 1, columnId: prevState.model.columns[1].id },
		];

		//Act
		const nextState = updateStateWithImportData(
			prevState,
			data,
			columnMatches
		);

		//Assert
		expect(nextState.model.bodyCells.length).toEqual(8);
		expect(nextState.model.bodyRows.length).toEqual(4);
		expect(nextState.model.bodyCells[0].markdown).toEqual("data 1");
		expect(nextState.model.bodyCells[1].markdown).toEqual("data 2");
		expect(nextState.model.bodyCells[2].markdown).toEqual("data 3");
		expect(nextState.model.bodyCells[3].markdown).toEqual("data 4");
		expect(nextState.model.bodyCells[4].markdown).toEqual("import 1");
		expect(nextState.model.bodyCells[5].markdown).toEqual("import 2");
		expect(nextState.model.bodyCells[6].markdown).toEqual("import 3");
		expect(nextState.model.bodyCells[7].markdown).toEqual("import 4");
	});
	it("imports data into a table of smaller size", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		prevState.model.bodyCells[0].markdown = "data 1";

		const data: ImportData = [
			["header 1", "header 2"],
			["import 1", "import 2"],
			["import 3", "import 4"],
		];

		const columnMatches: ColumnMatch[] = [
			{ importColumnIndex: 0, columnId: NEW_COLUMN_ID },
			{ importColumnIndex: 1, columnId: prevState.model.columns[0].id },
		];

		//Act
		const nextState = updateStateWithImportData(
			prevState,
			data,
			columnMatches
		);

		//Assert
		expect(nextState.model.columns.length).toEqual(2);
		expect(nextState.model.headerCells.length).toEqual(2);
		expect(nextState.model.footerCells.length).toEqual(4); //TODO remove
		expect(nextState.model.bodyCells.length).toEqual(6);
		expect(nextState.model.bodyRows.length).toEqual(3);
		expect(nextState.model.bodyCells[0].markdown).toEqual("data 1");
		expect(nextState.model.bodyCells[1].markdown).toEqual("");
		expect(nextState.model.bodyCells[2].markdown).toEqual("import 2");
		expect(nextState.model.bodyCells[3].markdown).toEqual("import 1");
		expect(nextState.model.bodyCells[4].markdown).toEqual("import 4");
		expect(nextState.model.bodyCells[5].markdown).toEqual("import 3");
	});

	it("imports data into a table of larger size", () => {
		//Arrange
		const prevState = createTestLoomState(3, 2);
		prevState.model.bodyCells[0].markdown = "data 1";
		prevState.model.bodyCells[1].markdown = "data 2";
		prevState.model.bodyCells[2].markdown = "data 3";
		prevState.model.bodyCells[3].markdown = "data 4";
		prevState.model.bodyCells[4].markdown = "data 5";
		prevState.model.bodyCells[5].markdown = "data 6";

		const data: ImportData = [
			["header 1", "header 2"],
			["import 1", "import 2"],
			["import 3", "import 4"],
		];

		const columnMatches: ColumnMatch[] = [
			{ importColumnIndex: 0, columnId: NEW_COLUMN_ID },
			{ importColumnIndex: 1, columnId: prevState.model.columns[0].id },
		];

		//Act
		const nextState = updateStateWithImportData(
			prevState,
			data,
			columnMatches
		);

		//Assert
		expect(nextState.model.columns.length).toEqual(4);
		expect(nextState.model.headerCells.length).toEqual(4);
		expect(nextState.model.footerCells.length).toEqual(8); //TODO remove
		expect(nextState.model.bodyCells.length).toEqual(16);
		expect(nextState.model.bodyRows.length).toEqual(4);
		expect(nextState.model.bodyCells[0].markdown).toEqual("data 1");
		expect(nextState.model.bodyCells[1].markdown).toEqual("data 2");
		expect(nextState.model.bodyCells[2].markdown).toEqual("data 3");
		expect(nextState.model.bodyCells[3].markdown).toEqual("data 4");
		expect(nextState.model.bodyCells[4].markdown).toEqual("data 5");
		expect(nextState.model.bodyCells[5].markdown).toEqual("data 6");
		expect(nextState.model.bodyCells[6].markdown).toEqual("");
		expect(nextState.model.bodyCells[7].markdown).toEqual("");
		expect(nextState.model.bodyCells[8].markdown).toEqual("import 2");
		expect(nextState.model.bodyCells[9].markdown).toEqual("");
		expect(nextState.model.bodyCells[10].markdown).toEqual("");
		expect(nextState.model.bodyCells[11].markdown).toEqual("import 1");
		expect(nextState.model.bodyCells[12].markdown).toEqual("import 4");
		expect(nextState.model.bodyCells[13].markdown).toEqual("");
		expect(nextState.model.bodyCells[14].markdown).toEqual("");
		expect(nextState.model.bodyCells[15].markdown).toEqual("import 3");
	});
});

//TODO add tests for tags, date cell, etc
