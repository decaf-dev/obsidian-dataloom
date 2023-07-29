import React from "react";

import { TableVirtuoso, VirtuosoHandle } from "react-virtuoso";

import { HeaderTableRow, TableRow } from "./types";

import TableBodyRow from "./table-body-row";
import TableHeaderCell from "./table-header-cell";
import { usePrevious } from "src/shared/hooks";

import "./styles.css";

interface Props {
	headerRows: HeaderTableRow[];
	bodyRows: TableRow[];
}

const Table = React.forwardRef<VirtuosoHandle, Props>(function Table(
	{ headerRows, bodyRows },
	ref
) {
	const previousRowLength = usePrevious(bodyRows.length);

	/**
	 * Scrolls to the bottom of the page when the "New Row" button is pressed
	 */
	React.useEffect(() => {
		if (previousRowLength === undefined) return;
		if (previousRowLength < bodyRows.length)
			(
				ref as React.MutableRefObject<VirtuosoHandle | null>
			).current?.scrollToIndex(bodyRows.length - 1);
	}, [previousRowLength, bodyRows.length]);

	return (
		<TableVirtuoso
			ref={ref}
			overscan={10}
			style={{
				width: "100%",
				height: "100%",
			}}
			totalCount={bodyRows.length}
			components={{
				Table: ({ style, ...props }) => {
					return <div className="dataloom-table" {...props} />;
				},
				TableHead: React.forwardRef(({ style, ...props }, ref) => (
					<div className="dataloom-head" {...props} ref={ref} />
				)),
				TableRow: ({ style, ...props }) => {
					return <TableBodyRow {...props} style={style} />;
				},
				TableBody: React.forwardRef(({ style, ...props }, ref) => (
					<div
						className="dataloom-body"
						{...props}
						style={style}
						ref={ref}
					/>
				)),
				FillerRow: ({ height }) => {
					return <div className="dataloom-row" style={{ height }} />;
				},
			}}
			fixedHeaderContent={() =>
				headerRows.map((row) => {
					const { id: rowId, cells } = row;
					return (
						<div
							key={rowId}
							className="dataloom-row dataloom-row--head"
						>
							{cells.map((cell, i) => {
								const { id: cellId, columnId, content } = cell;
								return (
									<TableHeaderCell
										key={cellId}
										columnId={columnId}
										content={content}
										isDraggable={i < cells.length - 1}
									/>
								);
							})}
						</div>
					);
				})
			}
			itemContent={(index) => {
				const row = bodyRows[index];
				const { id: rowId, cells } = row;
				return cells.map((cell, i) => {
					const { id: cellId, content } = cell;
					return (
						<div
							key={cellId}
							className="dataloom-cell dataloom-cell--body"
							data-row-id={i === 0 ? rowId : undefined}
						>
							{content}
						</div>
					);
				});
			}}
		/>
	);
});

export default Table;
