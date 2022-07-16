import { useMemo, useState, useCallback } from "react";

import { numToPx } from "src/app/services/string/parsers";

interface CellSize {
	columnIndex: number;
	rowIndex: number;
	width: number;
	height: number;
}

export const findCellStyle = (width: string, height: string) => {
	return {
		width,
		height,
	};
};

export const useCellSizing = () => {
	const [cellSizes, setCellSizes] = useState<CellSize[]>([]);
	const [shouldRecalculateRowHeights, recalculateRowHeights] =
		useState(false);

	const calculateCellHeight = (
		rowIndex: number,
		rowHeights: { [index: number]: number }
	) => {
		return shouldRecalculateRowHeights || rowHeights[rowIndex] === undefined
			? "max-content"
			: numToPx(rowHeights[rowIndex]);
	};

	const handleCellSizeChange = useCallback(
		(
			columnIndex: number,
			rowIndex: number,
			width: number,
			height: number
		) => {
			setCellSizes((prevState) => {
				const filtered = prevState.filter(
					(cell) =>
						cell.columnIndex !== columnIndex ||
						cell.rowIndex !== rowIndex
				);
				return [
					...filtered,
					{
						columnIndex,
						rowIndex,
						width,
						height,
					},
				];
			});
		},
		[]
	);

	//Finds the largest width out of every column
	//and the largest height out of every row
	//This is used to set the width and height of every cell in the table
	const [columnWidths, rowHeights] = useMemo(() => {
		const widths: { [index: number]: number } = {};
		const heights: { [index: number]: number } = {};
		cellSizes.forEach((size) => {
			const { columnIndex, rowIndex, width, height } = size;
			if (!widths[columnIndex] || widths[columnIndex] < width)
				widths[columnIndex] = width;
			if (!heights[rowIndex] || heights[rowIndex] < height)
				heights[rowIndex] = height;
		});
		return [widths, heights];
	}, [cellSizes]);

	return {
		columnWidths,
		rowHeights,
		shouldRecalculateRowHeights,
		recalculateRowHeights,
		calculateCellHeight,
		handleCellSizeChange,
	};
};
