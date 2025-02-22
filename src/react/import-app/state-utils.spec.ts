import {
	createColumn,
	createGenericLoomState,
	createMultiTagCell,
	createRow,
	createTag,
	createTextCell,
} from "src/shared/loom-state/loom-state-factory";
import {
	CellType,
	type Column,
	type MultiTagCell,
	type Row,
	type TextCell,
} from "src/shared/loom-state/types/loom-state";
import { NEW_COLUMN_ID } from "./constants";
import { addImportData } from "./state-utils";
import { type ColumnMatch, type ImportData } from "./types";

describe("addImportData", () => {
	it("imports data into a table of the same size", () => {
		const initialState = () => {
			const columns: Column[] = [createColumn(), createColumn()];
			const rows: Row[] = [
				createRow(0, {
					cells: [
						createTextCell(columns[0].id, {
							content: "data 1",
						}),
						createTextCell(columns[1].id, {
							content: "data 2",
						}),
					],
				}),
				createRow(1, {
					cells: [
						createTextCell(columns[0].id, {
							content: "data 3",
						}),
						createTextCell(columns[1].id, {
							content: "data 4",
						}),
					],
				}),
			];

			const state = createGenericLoomState({
				columns,
				rows,
			});
			return state;
		};

		const prevState = initialState();

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
		const nextState = addImportData(
			prevState,
			data,
			columnMatches,
			null,
			null
		);

		//Assert
		expect(nextState.model.rows.length).toEqual(4);
		expect(nextState.model.rows[0].cells.length).toEqual(2);
		expect(nextState.model.rows[1].cells.length).toEqual(2);
		expect(nextState.model.rows[2].cells.length).toEqual(2);
		expect(nextState.model.rows[3].cells.length).toEqual(2);
		expect((nextState.model.rows[0].cells[0] as TextCell).content).toEqual(
			"data 1"
		);
		expect((nextState.model.rows[0].cells[1] as TextCell).content).toEqual(
			"data 2"
		);
		expect((nextState.model.rows[1].cells[0] as TextCell).content).toEqual(
			"data 3"
		);
		expect((nextState.model.rows[1].cells[1] as TextCell).content).toEqual(
			"data 4"
		);
		expect((nextState.model.rows[2].cells[0] as TextCell).content).toEqual(
			"import 1"
		);
		expect((nextState.model.rows[2].cells[1] as TextCell).content).toEqual(
			"import 2"
		);
		expect((nextState.model.rows[3].cells[0] as TextCell).content).toEqual(
			"import 3"
		);
		expect((nextState.model.rows[3].cells[1] as TextCell).content).toEqual(
			"import 4"
		);
	});
	it("imports data into a table of smaller size", () => {
		//Arrange
		const initialState = () => {
			const columns: Column[] = [createColumn()];
			const rows: Row[] = [
				createRow(0, {
					cells: [
						createTextCell(columns[0].id, {
							content: "data 1",
						}),
					],
				}),
			];

			const state = createGenericLoomState({
				columns,
				rows,
			});
			return state;
		};

		const prevState = initialState();

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
		const nextState = addImportData(
			prevState,
			data,
			columnMatches,
			null,
			null
		);

		//Assert
		expect(nextState.model.columns.length).toEqual(2);
		expect(nextState.model.rows.length).toEqual(3);
		expect((nextState.model.rows[0].cells[0] as TextCell).content).toEqual(
			"data 1"
		);
		expect((nextState.model.rows[0].cells[1] as TextCell).content).toEqual(
			""
		);
		expect((nextState.model.rows[1].cells[0] as TextCell).content).toEqual(
			"import 2"
		);
		expect((nextState.model.rows[1].cells[1] as TextCell).content).toEqual(
			"import 1"
		);
		expect((nextState.model.rows[2].cells[0] as TextCell).content).toEqual(
			"import 4"
		);
		expect((nextState.model.rows[2].cells[1] as TextCell).content).toEqual(
			"import 3"
		);
	});

	it("imports data into a table of larger size", () => {
		//Arrange
		const initialState = () => {
			const columns: Column[] = [
				createColumn(),
				createColumn(),
				createColumn(),
			];
			const rows: Row[] = [
				createRow(0, {
					cells: [
						createTextCell(columns[0].id, {
							content: "data 1",
						}),
						createTextCell(columns[1].id, {
							content: "data 2",
						}),
						createTextCell(columns[2].id, {
							content: "data 3",
						}),
					],
				}),
				createRow(1, {
					cells: [
						createTextCell(columns[0].id, {
							content: "data 4",
						}),
						createTextCell(columns[1].id, {
							content: "data 5",
						}),
						createTextCell(columns[2].id, {
							content: "data 6",
						}),
					],
				}),
			];

			const state = createGenericLoomState({
				columns,
				rows,
			});
			return state;
		};

		const prevState = initialState();

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
		const nextState = addImportData(
			prevState,
			data,
			columnMatches,
			null,
			null
		);

		//Assert
		expect(nextState.model.columns.length).toEqual(4);
		expect(nextState.model.rows.length).toEqual(4);
		expect((nextState.model.rows[0].cells[0] as TextCell).content).toEqual(
			"data 1"
		);
		expect((nextState.model.rows[0].cells[1] as TextCell).content).toEqual(
			"data 2"
		);
		expect((nextState.model.rows[0].cells[2] as TextCell).content).toEqual(
			"data 3"
		);
		expect((nextState.model.rows[0].cells[3] as TextCell).content).toEqual(
			""
		);
		expect((nextState.model.rows[1].cells[0] as TextCell).content).toEqual(
			"data 4"
		);
		expect((nextState.model.rows[1].cells[1] as TextCell).content).toEqual(
			"data 5"
		);
		expect((nextState.model.rows[1].cells[2] as TextCell).content).toEqual(
			"data 6"
		);
		expect((nextState.model.rows[1].cells[3] as TextCell).content).toEqual(
			""
		);
		expect((nextState.model.rows[2].cells[0] as TextCell).content).toEqual(
			"import 2"
		);
		expect((nextState.model.rows[2].cells[1] as TextCell).content).toEqual(
			""
		);
		expect((nextState.model.rows[2].cells[2] as TextCell).content).toEqual(
			""
		);
		expect((nextState.model.rows[2].cells[3] as TextCell).content).toEqual(
			"import 1"
		);
		expect((nextState.model.rows[3].cells[0] as TextCell).content).toEqual(
			"import 4"
		);
		expect((nextState.model.rows[3].cells[1] as TextCell).content).toEqual(
			""
		);
		expect((nextState.model.rows[3].cells[2] as TextCell).content).toEqual(
			""
		);
		expect((nextState.model.rows[3].cells[3] as TextCell).content).toEqual(
			"import 3"
		);
	});

	it("uses existing column tags", () => {
		//Arrange
		const initialState = () => {
			const columns = [
				createColumn({
					type: CellType.MULTI_TAG,
					tags: [createTag("tag1"), createTag("tag2")],
				}),
			];
			const rows = [
				createRow(0, {
					cells: [
						createMultiTagCell(columns[0].id, {
							tagIds: [columns[0].tags[0].id],
						}),
					],
				}),
			];
			const state = createGenericLoomState({
				columns,
				rows,
			});
			return state;
		};
		const prevState = initialState();

		const data: ImportData = [["header 1"], ["tag1,tag2"]];
		const columnMatches: ColumnMatch[] = [
			{
				importColumnIndex: 0,
				columnId: prevState.model.columns[0].id,
			},
		];

		//Act
		const nextState = addImportData(
			prevState,
			data,
			columnMatches,
			null,
			null
		);
		expect(nextState.model.rows.length).toEqual(2);
		expect(nextState.model.rows[0].cells.length).toEqual(1);
		expect(nextState.model.rows[1].cells.length).toEqual(1);
		expect(
			(nextState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).toEqual([prevState.model.columns[0].tags[0].id]);
		expect(
			(nextState.model.rows[1].cells[0] as MultiTagCell).tagIds
		).toEqual([
			prevState.model.columns[0].tags[0].id,
			prevState.model.columns[0].tags[1].id,
		]);
	});

	it("uses existing column tags", () => {
		//Arrange
		const initialState = () => {
			const columns = [
				createColumn({
					type: CellType.MULTI_TAG,
					tags: [createTag("tag1"), createTag("tag2")],
				}),
			];
			const rows = [
				createRow(0, {
					cells: [
						createMultiTagCell(columns[0].id, {
							tagIds: [
								columns[0].tags[0].id,
								columns[0].tags[1].id,
							],
						}),
					],
				}),
			];
			const state = createGenericLoomState({
				columns,
				rows,
			});
			return state;
		};
		const prevState = initialState();

		const data: ImportData = [["header 1"], ["tag1,tag2"]];
		const columnMatches: ColumnMatch[] = [
			{
				importColumnIndex: 0,
				columnId: prevState.model.columns[0].id,
			},
		];

		//Act
		const nextState = addImportData(
			prevState,
			data,
			columnMatches,
			null,
			null
		);
		expect(nextState.model.rows.length).toEqual(2);
		expect(nextState.model.rows[0].cells.length).toEqual(1);
		expect(nextState.model.rows[1].cells.length).toEqual(1);
		expect(
			(nextState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).toEqual([
			prevState.model.columns[0].tags[0].id,
			prevState.model.columns[0].tags[1].id,
		]);
		expect(
			(nextState.model.rows[1].cells[0] as MultiTagCell).tagIds
		).toEqual([
			prevState.model.columns[0].tags[0].id,
			prevState.model.columns[0].tags[1].id,
		]);
	});

	it("adds new column tags", () => {
		//Arrange
		const initalState = () => {
			const columns = [
				createColumn({
					type: CellType.MULTI_TAG,
					tags: [createTag("tag1"), createTag("tag2")],
				}),
			];
			const rows = [
				createRow(0, {
					cells: [
						createMultiTagCell(columns[0].id, {
							tagIds: [
								columns[0].tags[0].id,
								columns[0].tags[1].id,
							],
						}),
					],
				}),
			];
			const state = createGenericLoomState({
				columns,
				rows,
			});
			return state;
		};
		const prevState = initalState();

		const data: ImportData = [["header 1"], ["tag3,tag4"]];
		const columnMatches: ColumnMatch[] = [
			{
				importColumnIndex: 0,
				columnId: prevState.model.columns[0].id,
			},
		];

		//Act
		const nextState = addImportData(
			prevState,
			data,
			columnMatches,
			null,
			null
		);
		expect(nextState.model.rows.length).toEqual(2);
		expect(nextState.model.columns[0].tags.length).toEqual(4);
		expect(nextState.model.rows[0].cells.length).toEqual(1);
		expect(nextState.model.rows[1].cells.length).toEqual(1);
		expect(
			(nextState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).toEqual([
			prevState.model.columns[0].tags[0].id,
			prevState.model.columns[0].tags[1].id,
		]);
		expect(
			(nextState.model.rows[1].cells[0] as MultiTagCell).tagIds
		).not.toEqual([
			prevState.model.columns[0].tags[0].id,
			prevState.model.columns[0].tags[1].id,
		]);
	});
});

//TODO add tests for spacing
//TODO add tests for tags, date cell, etc
