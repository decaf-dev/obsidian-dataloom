import React, { useEffect, useRef, useState } from "react";

import { CellType, TableModel } from "./types";
import { numToPx } from "../string/conversion";

export const findCellWidth = (
	columnType: string,
	useAutoWidth: boolean,
	calculatedWidth: number,
	width: string
) => {
	if (columnType !== CellType.TEXT && columnType !== CellType.NUMBER)
		return width;
	if (useAutoWidth) return numToPx(calculatedWidth);
	return width;
};

export const useTableSizing = (model: TableModel) => {
	const { cells, columnIds } = model;

	const cellRefs = useRef([]);
	const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
		{}
	);
	const [rowHeights, setRowHeights] = useState<{ [key: string]: number }>({});

	useEffect(() => {
		function getColumnWidths(
			numColumns: number,
			cellRefs: React.MutableRefObject<any>
		) {
			const widths: { [key: string]: number } = {};
			let columnIndex = 0;
			for (let i = 0; i < cells.length; i++) {
				const ref = cellRefs.current[i];
				const width = ref.offsetWidth;
				if (!widths[columnIndex] || widths[columnIndex] < width)
					widths[columnIndex] = width;
				if ((i + 1) % numColumns === 0) columnIndex = 0;
				else columnIndex++;
			}
			return widths;
		}

		function getRowHeights(
			numColumns: number,
			cellRefs: React.MutableRefObject<any>
		) {
			const heights: { [key: string]: number } = {};
			let rowIndex = 0;
			for (let i = 0; i < cells.length; i++) {
				const ref = cellRefs.current[i];
				const height = ref.offsetHeight;
				if (!heights[rowIndex] || heights[rowIndex] < height)
					heights[rowIndex] = height;
				if ((i + 1) % numColumns === 0) rowIndex++;
			}
			return heights;
		}

		if (cellRefs.current.length !== 0) {
			const numColumns = columnIds.length;
			setColumnWidths(getColumnWidths(numColumns, cellRefs));
			setRowHeights(getRowHeights(numColumns, cellRefs));
		}
	}, [columnIds.length, cells.length]);

	return { columnWidths, rowHeights, cellRefs };
};
