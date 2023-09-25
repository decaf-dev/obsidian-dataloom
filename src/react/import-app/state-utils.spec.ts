import { createTestLoomState } from "src/shared/loom-state/loom-state-factory";
import { ColumnMatch, ImportData } from "./types";
import { addImportData } from "./state-utils";
import { NEW_COLUMN_ID } from "./constants";

describe("addImportData", () => {
	it("imports data into a table of the same size", () => {
		//Arrange
		const prevState = createTestLoomState(2, 2);
		prevState.model.rows[0].cells[0].content = "data 1";
		prevState.model.rows[0].cells[1].content = "data 2";
		prevState.model.rows[1].cells[0].content = "data 3";
		prevState.model.rows[1].cells[1].content = "data 4";

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
		const nextState = addImportData(prevState, data, columnMatches);

		//Assert
		expect(nextState.model.rows.length).toEqual(4);
		expect(nextState.model.rows[0].cells.length).toEqual(2);
		expect(nextState.model.rows[1].cells.length).toEqual(2);
		expect(nextState.model.rows[2].cells.length).toEqual(2);
		expect(nextState.model.rows[3].cells.length).toEqual(2);
		expect(nextState.model.rows[0].cells[0].content).toEqual("data 1");
		expect(nextState.model.rows[0].cells[1].content).toEqual("data 2");
		expect(nextState.model.rows[1].cells[0].content).toEqual("data 3");
		expect(nextState.model.rows[1].cells[1].content).toEqual("data 4");
		expect(nextState.model.rows[2].cells[0].content).toEqual("import 1");
		expect(nextState.model.rows[2].cells[1].content).toEqual("import 2");
		expect(nextState.model.rows[3].cells[0].content).toEqual("import 3");
		expect(nextState.model.rows[3].cells[1].content).toEqual("import 4");
	});
	it("imports data into a table of smaller size", () => {
		//Arrange
		const prevState = createTestLoomState(1, 1);
		prevState.model.rows[0].cells[0].content = "data 1";

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
		const nextState = addImportData(prevState, data, columnMatches);

		//Assert
		expect(nextState.model.columns.length).toEqual(2);
		expect(nextState.model.rows.length).toEqual(3);
		expect(nextState.model.rows[0].cells[0].content).toEqual("data 1");
		expect(nextState.model.rows[0].cells[1].content).toEqual("");
		expect(nextState.model.rows[1].cells[0].content).toEqual("import 2");
		expect(nextState.model.rows[1].cells[1].content).toEqual("import 1");
		expect(nextState.model.rows[2].cells[0].content).toEqual("import 4");
		expect(nextState.model.rows[2].cells[1].content).toEqual("import 3");
	});

	it("imports data into a table of larger size", () => {
		//Arrange
		const prevState = createTestLoomState(3, 2);
		prevState.model.rows[0].cells[0].content = "data 1";
		prevState.model.rows[0].cells[1].content = "data 2";
		prevState.model.rows[0].cells[2].content = "data 3";
		prevState.model.rows[1].cells[0].content = "data 4";
		prevState.model.rows[1].cells[1].content = "data 5";
		prevState.model.rows[1].cells[2].content = "data 6";

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
		const nextState = addImportData(prevState, data, columnMatches);

		//Assert
		expect(nextState.model.columns.length).toEqual(4);
		expect(nextState.model.rows.length).toEqual(4);
		expect(nextState.model.rows[0].cells[0].content).toEqual("data 1");
		expect(nextState.model.rows[0].cells[1].content).toEqual("data 2");
		expect(nextState.model.rows[0].cells[2].content).toEqual("data 3");
		expect(nextState.model.rows[0].cells[3].content).toEqual("");
		expect(nextState.model.rows[1].cells[0].content).toEqual("data 4");
		expect(nextState.model.rows[1].cells[1].content).toEqual("data 5");
		expect(nextState.model.rows[1].cells[2].content).toEqual("data 6");
		expect(nextState.model.rows[1].cells[3].content).toEqual("");
		expect(nextState.model.rows[2].cells[0].content).toEqual("import 2");
		expect(nextState.model.rows[2].cells[1].content).toEqual("");
		expect(nextState.model.rows[2].cells[2].content).toEqual("");
		expect(nextState.model.rows[2].cells[3].content).toEqual("import 1");
		expect(nextState.model.rows[3].cells[0].content).toEqual("import 4");
		expect(nextState.model.rows[3].cells[1].content).toEqual("");
		expect(nextState.model.rows[3].cells[2].content).toEqual("");
		expect(nextState.model.rows[3].cells[3].content).toEqual("import 3");
	});
});

//TODO add tests for tags, date cell, etc
