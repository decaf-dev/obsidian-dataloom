import { CellType, TableState } from "../table/types";
import { randomTagId, randomColor } from "../random";
import { markdownToHtml } from "../io/deserialize";

export const changeColumnType = (
	prevState: TableState,
	columnId: string,
	type: CellType
) => {
	const { settings } = prevState;
	const { type: previousType } = settings.columns[columnId];

	//If same type return
	if (previousType === type) return prevState;

	let tags = [...settings.columns[columnId].tags];

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
