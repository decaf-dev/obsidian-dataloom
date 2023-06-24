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
import { usePrevious } from "src/shared/hooks";

interface Props {
	headerRows: RenderTableHeaderRow[];
	bodyRows: RenderTableBodyRow[];
	footerRows: RenderTableFooterRow[];
}

export default function Table({ headerRows, bodyRows, footerRows }: Props) {
	const tableRef = React.useRef<VirtuosoHandle>(null);

	const previousRowLength = usePrevious(bodyRows.length);

	/**
	 * Scrolls to the bottom of the page when the "New Row" button is pressed
	 */
	React.useEffect(() => {
		if (previousRowLength === undefined) return;
		if (previousRowLength < bodyRows.length)
			tableRef.current?.scrollToIndex(bodyRows.length - 1);
	}, [previousRowLength, bodyRows.length]);

	return (
		<TableVirtuoso
			tabIndex={-1}
			ref={tableRef}
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
						<tr
							key={rowId}
							css={css`
								background-color: var(--background-secondary);
							`}
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
								<td
									key={id}
									className="Dashboards__footer-td"
									css={css`
										padding: 0px;
									`}
								>
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
								border-bottom: 1px solid
									var(--table-border-color);
								border-left: 1px solid var(--table-border-color);
								border-right: 0;
								padding: 0;
								overflow: visible;
								vertical-align: top;
								color: var(
									--text-normal
								); //Prevents hover style in embedded table
								color: var(--text-normal);
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
							className="Dashboards__body-td"
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
				className="Dashboards__table"
			/>
		);
	},
	TableRow: ({ style, ...props }) => {
		return <TableBodyRow {...props} style={style} />;
	},
	TableBody: React.forwardRef(({ style, ...props }, ref) => (
		<tbody {...props} style={style} ref={ref} />
	)),
	TableFoot: React.forwardRef(({ style, ...props }, ref) => (
		<tfoot
			css={css`
				position: sticky;
				bottom: 0;
				background-color: var(--background-primary);

				& > tr:first-of-type > td {
					border-bottom: 1px solid var(--table-border-color);
				}

				& > tr:first-of-type > td:nth-of-type(1) {
					border-bottom: 0;
				}

				& > tr:first-of-type > td:nth-of-type(2) {
					border-left: 1px solid var(--table-border-color);
				}

				& > tr:first-of-type > td:last-child {
					border-left: 1px solid var(--table-border-color);
					border-bottom: 0;
				}
			`}
			{...props}
			style={style}
			ref={ref}
		/>
	)),
};
