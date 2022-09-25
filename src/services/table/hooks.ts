import { TableState } from "./types";
import { pxToNum, numToPx } from "../string/conversion";
import { MIN_COLUMN_WIDTH } from "./constants";

interface CellMeasurement extends Measurement {
	rowId: string;
	columnId: string;
}

interface Measurement {
	width: number;
	height: number;
}

const measureCell = (
	html: string,
	useAutoWidth: boolean,
	columnWidth: string,
	shouldWrapOverflow: boolean
): Measurement => {
	const ruler = document.createElement("div");

	if (useAutoWidth) {
		ruler.style.width = "max-content";
		ruler.style.height = "auto";
		ruler.style.overflowWrap = "normal";
	} else {
		ruler.style.width = columnWidth;
		ruler.style.height = "max-content";
		if (shouldWrapOverflow) {
			ruler.style.overflowWrap = "break-word";
		} else {
			ruler.style.overflowWrap = "normal";
			ruler.style.whiteSpace = "nowrap";
			ruler.style.overflow = "hidden";
			ruler.style.textOverflow = "ellipsis";
		}
	}
	//This is the same as the padding set to every cell
	ruler.style.paddingTop = "4px";
	ruler.style.paddingBottom = "4px";
	ruler.style.paddingLeft = "10px";
	ruler.style.paddingRight = "10px";
	ruler.innerHTML = html;

	document.body.appendChild(ruler);
	const width = window.getComputedStyle(ruler).getPropertyValue("width");
	const height = window.getComputedStyle(ruler).getPropertyValue("height");
	document.body.removeChild(ruler);

	return { width: pxToNum(width), height: pxToNum(height) };
};

const measureCells = (state: TableState): CellMeasurement[] => {
	return state.model.cells.map((cell) => {
		const columnSettings = state.settings.columns[cell.columnId];
		const { width, height } = measureCell(
			cell.html,
			columnSettings.useAutoWidth,
			columnSettings.width,
			columnSettings.shouldWrapOverflow
		);
		return {
			rowId: cell.rowId,
			columnId: cell.columnId,
			width,
			height,
		};
	});
};

const findColumnWidths = (cellMeasurements: CellMeasurement[]) => {
	const widths: { [id: string]: number } = {};
	cellMeasurements.forEach((m) => {
		const { columnId, width } = m;
		if (!widths[columnId] || widths[columnId] < width)
			widths[columnId] = width;
		if (widths[columnId] < MIN_COLUMN_WIDTH)
			widths[columnId] = MIN_COLUMN_WIDTH;
	});
	return Object.fromEntries(
		Object.entries(widths).map((entry) => {
			const [key, value] = entry;
			return [key, numToPx(value)];
		})
	);
};

const findRowHeights = (cellMeasurements: CellMeasurement[]) => {
	const heights: { [id: string]: number } = {};
	cellMeasurements.forEach((m) => {
		const { rowId, height } = m;
		if (!heights[rowId] || heights[rowId] < height) heights[rowId] = height;
	});
	return Object.fromEntries(
		Object.entries(heights).map((entry) => {
			const [key, value] = entry;
			return [key, numToPx(value)];
		})
	);
};

export const getTableSizing = (state: TableState) => {
	const cellMeasurements = measureCells(state);
	const columnWidths = findColumnWidths(cellMeasurements);
	const rowHeights = findRowHeights(cellMeasurements);
	return {
		columnWidths,
		rowHeights,
	};
};
