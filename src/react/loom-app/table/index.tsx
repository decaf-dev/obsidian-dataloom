import React from "react";

import { TableComponents, TableVirtuoso, VirtuosoHandle } from "react-virtuoso";

import BodyRow from "./body-row";
import HeaderCell from "./header-cell";
import BodyCell from "./body-cell";
import FooterCell from "./footer-cell";

import { usePrevious } from "src/shared/hooks";
import { BodyTableRow, HeaderTableRow, TableRow } from "./types";

import "./styles.css";

interface Props {
	headerRow: HeaderTableRow;
	bodyRows: BodyTableRow[];
	footer?: TableRow;
	numFrozenColumns: number;
}

const Table = React.forwardRef<VirtuosoHandle, Props>(function Table(
	{ headerRow, bodyRows, footer, numFrozenColumns },
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
			fixedHeaderContent={() => {
				const { cells } = headerRow;
				return (
					<div className="dataloom-row">
						{cells.map((cell, i) => {
							const { columnId, content } = cell;
							return (
								<HeaderCell
									key={columnId}
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
			}}
			fixedFooterContent={() => {
				if (!footer) return null;
				return (
					<div className="dataloom-row">
						{footer.cells.map((cell, i) => {
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
				);
			}}
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
	TableHead: React.forwardRef(({ ...props }, ref) => {
		return (
			<div
				className="dataloom-header"
				{...props}
				style={{
					position: undefined,
					top: undefined,
					zIndex: undefined,
				}}
				ref={ref}
			/>
		);
	}),
	TableRow: ({ style, ...props }) => {
		return <BodyRow {...props} style={style} />;
	},
	TableBody: React.forwardRef(({ style, ...props }, ref) => (
		<div className="dataloom-body" {...props} style={style} ref={ref} />
	)),
	//Don't apply styles because we want to apply sticky positioning
	//to the cells, not the footer container
	TableFoot: React.forwardRef(({ ...props }, ref) => (
		<div
			className="dataloom-footer"
			{...props}
			style={{
				position: undefined,
				bottom: undefined,
				zIndex: undefined,
			}}
			ref={ref}
		/>
	)),
	FillerRow: ({ height }) => {
		return <div className="dataloom-row" style={{ height }} />;
	},
};

export default Table;
