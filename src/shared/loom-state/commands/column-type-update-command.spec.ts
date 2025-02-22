import {
	createColumn,
	createDateCell,
	createGenericLoomState,
	createLoomState,
	createMultiTagCell,
	createRow,
	createTag,
	createTagCell,
	createTextCell,
	createTextFilter,
} from "src/shared/loom-state/loom-state-factory";
import {
	CellType,
	type CheckboxCell,
	type Column,
	type Filter,
	type MultiTagCell,
	type Row,
	type TagCell,
	type TextCell,
} from "../types/loom-state";
import ColumnTypeUpdateCommand from "./column-type-update-command";

describe("column-type-update-command", () => {
	const generateStateWithTextColumn = () => {
		const columns: Column[] = [createColumn()];
		const rows: Row[] = [
			createRow(0, {
				cells: [
					createTextCell(columns[0].id, {
						content: "test1,test2",
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

	const generateStateWithTextColumnAndFilters = () => {
		const columns: Column[] = [createColumn()];
		const rows: Row[] = [
			createRow(0, {
				cells: [createTextCell(columns[0].id)],
			}),
		];
		const filters: Filter[] = [
			createTextFilter(columns[0].id),
			createTextFilter(columns[0].id),
		];

		const state = createGenericLoomState({
			columns,
			rows,
			filters,
		});
		return state;
	};

	const generateStateWithTagColumn = () => {
		const columns: Column[] = [
			createColumn({
				type: CellType.TAG,
				tags: [createTag("test1")],
			}),
		];
		const rows: Row[] = [
			createRow(0, {
				cells: [
					createTagCell(columns[0].id, {
						tagId: columns[0].tags[0].id,
					}),
				],
			}),
			createRow(1, {
				cells: [
					createTagCell(columns[0].id, {
						tagId: columns[0].tags[0].id,
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

	const generateStateWithMultiTagColumn = () => {
		const columns: Column[] = [
			createColumn({
				type: CellType.MULTI_TAG,
				tags: [createTag("test1"), createTag("test2")],
			}),
		];
		const rows: Row[] = [
			createRow(0, {
				cells: [
					createMultiTagCell(columns[0].id, {
						tagIds: [columns[0].tags[0].id, columns[0].tags[1].id],
					}),
				],
			}),
			createRow(1, {
				cells: [
					createMultiTagCell(columns[0].id, {
						tagIds: [columns[0].tags[0].id, columns[0].tags[1].id],
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

	const generateStateWithDateColumn = () => {
		const columns: Column[] = [
			createColumn({
				type: CellType.DATE,
			}),
		];
		const rows: Row[] = [
			createRow(0, {
				cells: [
					createDateCell(columns[0].id, {
						dateTime: new Date("2020-01-01").toISOString(),
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

	it("should handle multi-tag -> text when execute() is called", async () => {
		//Arrange
		const prevState = generateStateWithMultiTagColumn();

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(
			(executeState.model.rows[0].cells[0] as TextCell).content
		).toEqual("test1,test2");
		expect(
			(executeState.model.rows[1].cells[0] as TextCell).content
		).toEqual("test1,test2");
	});

	it("should handle tag -> text when execute() is called", async () => {
		//Arrange
		const prevState = generateStateWithTagColumn();

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(executeState.model.columns[0].tags.length).toEqual(1);
		expect(
			(executeState.model.rows[0].cells[0] as TextCell).content
		).toEqual("test1");
		expect(
			(executeState.model.rows[1].cells[0] as TextCell).content
		).toEqual("test1");
	});

	it("should handle text -> tag when execute() is called", async () => {
		//Arrange
		const prevState = generateStateWithTextColumn();

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TAG);
		expect(executeState.model.columns[0].tags.length).toEqual(1);
		expect(executeState.model.columns[0].tags[0].content).toEqual(
			"test1,test2"
		);
		expect(
			(executeState.model.rows[0].cells[0] as TagCell).tagId
		).not.toBeNull();
	});

	it("should handle text -> multi-tag when execute() is called", async () => {
		//Arrange
		const prevState = generateStateWithTextColumn();

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.MULTI_TAG
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.MULTI_TAG);
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(executeState.model.columns[0].tags[0].content).toEqual("test1");
		expect(executeState.model.columns[0].tags[1].content).toEqual("test2");
		expect(
			(executeState.model.rows[0].cells[0] as MultiTagCell).tagIds
		).toHaveLength(2);
		expect(executeState.model.columns[0].tags).toHaveLength(2);
	});

	it("should handle multi-tag -> tag when execute() is called", async () => {
		//Arrange
		const prevState = generateStateWithMultiTagColumn();

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TAG);
		expect(executeState.model.columns[0].tags.length).toEqual(2);
		expect(
			(executeState.model.rows[0].cells[0] as TagCell).tagId
		).not.toBeNull();
	});

	it("should handle text -> checkbox when execute() is called", async () => {
		//Arrange
		const prevState = createLoomState(1, 1);

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.CHECKBOX
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.CHECKBOX);
		expect(
			(executeState.model.rows[0].cells[0] as CheckboxCell).value
		).toEqual(false);
	});

	it("should handle date -> text when execute() is called", async () => {
		//Arrange
		const prevState = generateStateWithDateColumn();

		const command = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TEXT
		);

		//Act
		const executeState = command.execute(prevState);

		//Assert
		expect(executeState.model.columns.length).toEqual(1);
		expect(executeState.model.columns[0].type).toEqual(CellType.TEXT);
		expect(
			(executeState.model.rows[0].cells[0] as TextCell).content
		).toEqual("12-31-2019");
	});

	it("should delete referenced filters when execute() is called", async () => {
		//Arrange
		const prevState = generateStateWithTextColumnAndFilters();

		//Act
		const executeState = new ColumnTypeUpdateCommand(
			prevState.model.columns[0].id,
			CellType.TAG
		).execute(prevState);

		//Assert
		expect(executeState.model.filters).toEqual([]);
	});
});
