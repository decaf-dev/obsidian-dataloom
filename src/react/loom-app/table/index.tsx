import React from "react";

import { TableComponents, TableVirtuoso, VirtuosoHandle } from "react-virtuoso";

import BodyRow from "./body-row";
import HeaderCell from "./header-cell";
import BodyCell from "./body-cell";
import FooterCell from "./footer-cell";

import { usePrevious } from "src/shared/hooks";
import { HeaderTableRow, TableRow } from "./types";

import "./styles.css";

interface Props {
	headerRows: HeaderTableRow[];
	bodyRows: TableRow[];
	footerRows: TableRow[];
	numFrozenColumns: number;
}

const Table = React.forwardRef<VirtuosoHandle, Props>(function Table(
	{ headerRows, bodyRows, footerRows, numFrozenColumns },
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
	}, [ref, previousRowLength, bodyRows.length]);

	return (
		<TableVirtuoso
			ref={ref}
			overscan={10}
			style={{
				width: "100%",
				height: "100%",
			}}
			totalCount={bodyRows.length}
			components={Components}
			fixedHeaderContent={() =>
				headerRows.map((row) => {
					const { id: rowId, cells } = row;
					return (
						<div key={rowId} className="dataloom-row">
							{cells.map((cell, i) => {
								const { id: cellId, columnId, content } = cell;
								return (
									<HeaderCell
										key={cellId}
										index={i}
										numFrozenColumns={numFrozenColumns}
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
			fixedFooterContent={() =>
				footerRows.map((row) => (
					<div className="dataloom-row" key={row.id}>
						{row.cells.map((cell, i) => {
							const { id, content } = cell;
							return (
								<FooterCell
									key={id}
									index={i}
									numFrozenColumns={numFrozenColumns}
									content={content}
								/>
							);
						})}
					</div>
				))
			}
			itemContent={(index) => {
				const row = bodyRows[index];
				const { id: rowId, cells } = row;
				return cells.map((cell, i) => {
					const { id, content } = cell;
					return (
						<BodyCell
							key={id}
							rowId={rowId}
							content={content}
							index={i}
							numFrozenColumns={numFrozenColumns}
						/>
					);
				});
			}}
		/>
	);
});

const Components: TableComponents = {
	Table: ({ ...props }) => {
		return <div className="dataloom-table" {...props} />;
	},
	//Don't apply styles because we want to apply sticky positioning
	//to the cells, not the header container
	TableHead: React.forwardRef(({ ...props }, ref) => (
		<div className="dataloom-header" {...props} ref={ref} />
	)),
	TableRow: ({ style, ...props }) => {
		return <BodyRow {...props} style={style} />;
	},
	TableBody: React.forwardRef(({ style, ...props }, ref) => (
		<div className="dataloom-body" {...props} style={style} ref={ref} />
	)),
	//Don't apply styles because we want to apply sticky positioning
	//to the cells, not the footer container
	TableFoot: React.forwardRef(({ ...props }, ref) => (
		<div className="dataloom-footer" {...props} ref={ref} />
	)),
	FillerRow: ({ height }) => {
		return <div className="dataloom-row" style={{ height }} />;
	},
};

export default Table;
