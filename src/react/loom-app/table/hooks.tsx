import React from "react";

export const useStickyOffset = (
	ref: React.RefObject<HTMLDivElement>,
	numFrozenColumns: number,
	columnIndex: number
) => {
	const [columnWidths, setColumnWidths] = React.useState<number[]>([]);
	React.useEffect(() => {
		if (!ref.current) return;
		if (columnIndex + 1 > numFrozenColumns) return;

		const tableEl = ref.current.closest(".dataloom-table");
		if (!tableEl) return;

		const columns = tableEl.querySelectorAll(".dataloom-cell--header");
		if (!columns) return;

		const observers: ResizeObserver[] = [];
		columns.forEach((column, i) => {
			if (i < columnIndex) {
				const observer = new ResizeObserver(() => {
					const rect = column.getBoundingClientRect();
					setColumnWidths((prevState) => {
						const newState = [...prevState];
						newState[i] = rect.width;
						return newState;
					});
				});
				observer.observe(column);
				observers.push(observer);
			}
		});

		return () => {
			observers.forEach((observer) => observer.disconnect());
		};
	}, [numFrozenColumns, columnIndex, ref]);

	const offset = columnWidths.reduce((a, b) => a + b, 0);
	return offset;
};
