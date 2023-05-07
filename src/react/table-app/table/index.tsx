import React from "react";

import { TableVirtuoso } from "react-virtuoso";

import {
	RenderTableBodyRow,
	RenderTableFooterRow,
	RenderTableHeaderRow,
} from "./types";
import "./styles.css";
import { Platform } from "obsidian";
import TableBodyRow from "./table-body-row";
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
			style={{
				width: "100%",
				height: "100%",
			}}
			totalCount={bodyRows.length}
			components={{
				Table: ({ style, ...props }) => {
					return (
						<table
							css={css`
								table-layout: fixed;
								border-collapse: separate;
							`}
							{...props}
							style={style}
						/>
					);
				},
				TableBody: React.forwardRef(({ style, ...props }, ref) => (
					<tbody {...props} ref={ref} />
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
							background-color: var(--background-primary);
							& > tr:first-of-type > td {
								border-bottom: 1px solid
									var(--background-modifier-border) !important;
							}
							& > tr:first-of-type > td:last-child {
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
							return <td key={id}>{content}</td>;
						})}
					</tr>
				))
			}
			itemContent={(index) => {
				const row = bodyRows[index];
				return row.cells.map((cell) => {
					const { id, content } = cell;
					return (
						<td
							key={id}
							css={css`
								border-top: 0 !important;
								border-bottom: 1px solid
									var(--background-modifier-border) !important;
								border-left: 1px solid
									var(--background-modifier-border) !important;
								border-right: 0 !important;
								padding: 0 !important;
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
									border-left: 0 !important;
								}

								&:last-child {
									border-bottom: 0 !important;
								}
							`}
						>
							{content}
						</td>
					);
				});
			}}
		/>
	);
}
