import { markdownToHtml } from "../io/deserialize";
import { TableState } from "./types";

export const updateCell = (
	prevState: TableState,
	cellId: string,
	markdown: string
) => {
	return {
		...prevState,
		model: {
			...prevState.model,
			cells: prevState.model.cells.map((cell) => {
				if (cell.id === cellId) {
					return {
						...cell,
						markdown,
						html: markdownToHtml(markdown),
					};
				}
				return cell;
			}),
		},
	};
};
