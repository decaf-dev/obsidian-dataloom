import React from "react";

import { TableVirtuoso } from "react-virtuoso";

import {
	RenderTableBodyRow,
	RenderTableFooterRow,
	RenderTableHeaderRow,
} from "./types";
import "./styles.css";
import { Platform } from "obsidian";
import { TableBodyRow } from "./table-body-row";
import TableCell from "./table-cell";
import TableHeaderCell from "./table-header-cell";
import { css } from "@emotion/react";

interface Props {
	headerRows: RenderTableHeaderRow[];
	bodyRows: RenderTableBodyRow[];
	footerRows: RenderTableFooterRow[];
}

export default function Table({ headerRows, bodyRows, footerRows }: Props) {
	const isMobile = Platform.isMobile || Platform.isMobileApp;
	let innerClassName = "NLT__table-inner";
	if (isMobile) {
		innerClassName += " NLT__table-inner--mobile";
	}

	//TODO handle mobile

	return (
		<TableVirtuoso
			style={{ height: "calc(100vh - 9.5rem)" }}
			totalCount={bodyRows.length}
			components={{
				Table: ({ style, ...props }) => {
					return (
						<table
							css={css`
								table-layout: fixed;
								border-collapse: collapse;
							`}
							{...props}
							style={style}
						/>
					);
				},
				TableBody: React.forwardRef(({ style, ...props }, ref) => (
					<tbody className="NLT__tbody" {...props} ref={ref} />
				)),
				TableRow: (props) => {
					const index = props["data-index"];
					const row = bodyRows[index];
					return <TableBodyRow id={row.id} {...props} />;
				},
				TableFoot: React.forwardRef(({ style, ...props }, ref) => (
					<tfoot
						css={css`
							position: sticky;
							bottom: 0;
							background-color: #fff;
							transform: translateZ(0);
							& > tr:first-child > td {
								border-bottom: 1px solid
									var(--background-modifier-border) !important;
							}
							& > tr:first-child > td:last-child {
								border-left: 1px solid
									var(--background-modifier-border) !important;
								border-bottom: 0 !important;
							}
						`}
						{...props}
						ref={ref}
					/>
				)),
			}}
			fixedHeaderContent={() =>
				headerRows.map((row) => {
					const { id: rowId, cells } = row;
					return (
						<tr key={rowId} className="NLT__tr">
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
					<tr key={row.id} className="NLT__tr">
						{row.cells.map((cell) => {
							const { id, content } = cell;
							return <td key={id}>{content}</td>;
						})}
					</tr>
				))
			}
			itemContent={(index) => {
				const row = bodyRows[index];
				return row.cells.map((cell) => {
					const { id, content } = cell;
					return <TableCell key={id} content={content} />;
				});
			}}
		/>

		// <table className="NLT__table">
		// 	<thead className="NLT__thead">
		// 		{headerRows.map((row) => (
		// 			<TableHeaderRow key={row.id} row={row} />
		// 		))}
		// 	</thead>
		// 	<tbody className="NLT__tbody">
		// 		{bodyRows.map((row) => (
		// 			<TableBodyRow key={row.id} row={row} />
		// 		))}
		// 	</tbody>
		// 	<tfoot className="NLT__tfoot">
		// 		{footerRows.map((row) => (
		// 			<TableFooterRow key={row.id} row={row} />
		// 		))}
		// 	</tfoot>
		// </table>
	);
}
