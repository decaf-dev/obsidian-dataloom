import React from "react";

import { TableVirtuoso, VirtuosoHandle, TableComponents } from "react-virtuoso";

import {
	RenderTableBodyRow,
	RenderTableFooterRow,
	RenderTableHeaderRow,
} from "./types";

import TableBodyRow from "./table-body-row";
import TableHeaderCell from "./table-header-cell";
import { css } from "@emotion/react";
import { useCompare } from "src/shared/hooks";
import { getTableBorderColor } from "src/shared/color";

interface Props {
	headerRows: RenderTableHeaderRow[];
	bodyRows: RenderTableBodyRow[];
	footerRows: RenderTableFooterRow[];
}

const tableBorderColor = getTableBorderColor();

export default function Table({ headerRows, bodyRows, footerRows }: Props) {
	const tableRef = React.useRef<VirtuosoHandle>(null);

	const didRowsChange = useCompare(bodyRows.length);

	/**
	 * Scrolls to the bottom of the page when the "New Row" button is pressed
	 */
	React.useEffect(() => {
		if (didRowsChange) tableRef.current?.scrollToIndex(bodyRows.length - 1);
		tableRef.current?.scrollTo;
	}, [didRowsChange, bodyRows.length]);

	return (
		<TableVirtuoso
			ref={tableRef}
			overscan={10}
			style={{
				width: "100%",
				height: "100%",
				marginBottom: "48px",
			}}
			totalCount={bodyRows.length}
			components={Components}
			fixedHeaderContent={() =>
				headerRows.map((row) => {
					const { id: rowId, cells } = row;
					return (
						<tr key={rowId}>
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
						</tr>
					);
				})
			}
			fixedFooterContent={() =>
				footerRows.map((row) => (
					<tr key={row.id}>
						{row.cells.map((cell) => {
							const { id, content } = cell;
							return (
								<td key={id} className="NLT__footer-td">
									{content}
								</td>
							);
						})}
					</tr>
				))
			}
			itemContent={(index) => {
				const row = bodyRows[index];
				const { id: rowId, cells } = row;
				return cells.map((cell, i) => {
					const { id: cellId, content } = cell;
					return (
						<td
							key={cellId}
							data-row-id={i === 0 ? rowId : undefined}
							css={css`
								border-top: 0;
								border-bottom: 1px solid ${tableBorderColor};
								border-left: 1px solid ${tableBorderColor};
								border-right: 0;
								padding: 0;
								overflow: visible;
								vertical-align: top;
								/** 
								* This is a hack to make the children have something to calculate their height percentage from.
								* i.e. if you have a child with height: 100%, it will be 100% of the height of the td, only
								* if the td has a set height value.
								* This doesn't represent the actual height of the td, as that is set by HTML
								*/
								height: 1px;

								&:first-of-type {
									border-left: 0;
									border-bottom: 0;
								}

								&:last-child {
									border-bottom: 0;
								}
							`}
							className="NLT__body-td"
						>
							{content}
						</td>
					);
				});
			}}
		/>
	);
}

const Components: TableComponents = {
	Table: ({ style, ...props }) => {
		return (
			<table
				css={css`
					table-layout: fixed;
					border-collapse: separate;
				`}
				{...props}
				style={style}
				className="NLT__table"
			/>
		);
	},
	TableRow: ({ style, ...props }) => {
		return <TableBodyRow {...props} />;
	},
	TableBody: React.forwardRef(({ style, ...props }, ref) => (
		<tbody {...props} ref={ref} />
	)),
	TableFoot: React.forwardRef(({ style, ...props }, ref) => (
		<tfoot
			css={css`
				position: sticky;
				bottom: 0;
				background-color: var(--background-primary);

				& > tr:first-of-type > td {
					border-bottom: 1px solid ${tableBorderColor};
				}

				& > tr:first-of-type > td:nth-of-type(1) {
					border-bottom: 0;
				}

				& > tr:first-of-type > td:nth-of-type(2) {
					border-left: 1px solid ${tableBorderColor};
				}

				& > tr:first-of-type > td:last-child {
					border-left: 1px solid ${tableBorderColor};
					border-bottom: 0;
				}
			`}
			{...props}
			ref={ref}
		/>
	)),
};
