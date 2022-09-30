import { markdownToHtml } from "../io/deserialize";
import {
	DEFAULT_COLUMN_SETTINGS,
	TableModel,
	TableSettings,
	Cell,
	TableState,
	CellType,
} from "./types";
import {
	randomCellId,
	randomColumnId,
	randomColor,
	randomTagId,
} from "../random";
import { sortCells } from "./utils";

export const addColumn = (
	prevState: TableState
): [TableModel, TableSettings] => {
	const columnId = randomColumnId();
	const updatedColumnIds = [...prevState.model.columnIds, columnId];
	let updatedCells: Cell[] = [...prevState.model.cells];

	for (let i = 0; i < prevState.model.rowIds.length; i++) {
		updatedCells.push({
			id: randomCellId(),
			columnId,
			rowId: prevState.model.rowIds[i],
			markdown: i === 0 ? "New Column" : "",
			html: i === 0 ? "New Column" : "",
			isHeader: i === 0,
		});
	}

	updatedCells = sortCells(
		prevState.model.rowIds,
		updatedColumnIds,
		updatedCells
	);

	return [
		{
			...prevState.model,
			columnIds: updatedColumnIds,
			cells: updatedCells,
		},
		{
			...prevState.settings,
			columns: {
				...prevState.settings.columns,
				[columnId]: DEFAULT_COLUMN_SETTINGS,
			},
		},
	];
};

export const changeColumnType = (
	prevState: TableState,
	columnId: string,
	type: CellType
) => {
	const { type: previousType } = prevState.settings.columns[columnId];

	//If same type return
	if (previousType === type) return prevState;

	let tags = [...prevState.settings.columns[columnId].tags];

	if (
		(previousType === CellType.MULTI_TAG && type !== CellType.TAG) ||
		(previousType === CellType.TAG && type !== CellType.MULTI_TAG)
	) {
		//Remove tag references to cells but don't delete the tags
		tags = tags.map((t) => {
			return {
				...t,
				cells: [],
			};
		});
	} else if (type === CellType.TAG || CellType.MULTI_TAG) {
		const cells = prevState.model.cells.filter(
			(cell) =>
				cell.columnId === columnId &&
				cell.markdown !== "" &&
				!cell.isHeader
		);
		cells.forEach((cell) => {
			cell.markdown.split(",").map((markdownTag, i) => {
				//We found a previous tag that matches this markdown
				const found = tags.find((t) => t.markdown === markdownTag);

				//If the tag that we want to add already exists
				if (found) {
					const index = tags.indexOf(found);
					//If we already have a reference to that tag
					if (
						found.cells.find(
							(c) =>
								c.columnId === cell.columnId &&
								c.rowId === cell.rowId
						)
					) {
						//And we allow only 1 selected tag, then remove the reference
						if (i > 0 && type === CellType.TAG) {
							tags[index].cells = tags[index].cells.filter(
								(c) =>
									c.columnId !== cell.columnId ||
									c.rowId !== cell.rowId
							);
						}
						//Else add a reference
					} else {
						tags[index].cells.push({
							columnId: cell.columnId,
							rowId: cell.rowId,
						});
					}
					return;
				}

				tags.push({
					id: randomTagId(),
					markdown: markdownTag,
					html: markdownToHtml(markdownTag),
					color: randomColor(),
					cells: [
						{
							columnId: cell.columnId,
							rowId: cell.rowId,
						},
					],
				});
			});
		});
	}
	return {
		...prevState,
		settings: {
			...prevState.settings,
			columns: {
				...prevState.settings.columns,
				[columnId]: {
					...prevState.settings.columns[columnId],
					type,
					tags,
				},
			},
		},
	};
};
