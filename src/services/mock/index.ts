import { CURRENT_PLUGIN_VERSION } from "src/constants";
import StateFactory from "../tableState/StateFactory";
import {
	BodyCell,
	Column,
	BodyRow,
	TableState,
	Tag,
	HeaderRow,
	FooterRow,
} from "../tableState/types";
import { HeaderCell } from "../tableState/types";
import { FooterCell } from "../tableState/types";

export const mockTableState = (
	numColumns: number,
	numRows: number
): TableState => {
	//Create columns
	const columns: Column[] = [];
	for (let i = 0; i < numColumns; i++)
		columns.push(StateFactory.createColumn());

	//Create headers
	const headerRows: HeaderRow[] = [];
	headerRows.push(StateFactory.createHeaderRow());

	const headerCells: HeaderCell[] = [];

	for (let x = 0; x < numColumns; x++) {
		headerCells.push(
			StateFactory.createHeaderCell(columns[x].id, headerRows[0].id)
		);
	}

	//Create body
	const bodyRows: BodyRow[] = [];
	for (let i = 0; i < numRows; i++)
		bodyRows.push(StateFactory.createBodyRow(i));

	const bodyCells: BodyCell[] = [];
	for (let y = 0; y < numRows; y++) {
		for (let x = 0; x < numColumns; x++) {
			bodyCells.push(
				StateFactory.createBodyCell(columns[x].id, bodyRows[y].id)
			);
		}
	}

	//Create footers
	const footerRows: FooterRow[] = [];
	footerRows.push(StateFactory.createFooterRow());
	footerRows.push(StateFactory.createFooterRow());

	const footerCells: FooterCell[] = [];

	for (let y = 0; y < 2; y++) {
		for (let x = 0; x < numColumns; x++) {
			footerCells.push(
				StateFactory.createFooterCell(columns[x].id, footerRows[y].id)
			);
		}
	}

	const tags: Tag[] = [];
	//TODO add tags
	return {
		model: {
			columns,
			headerRows,
			bodyRows,
			footerRows,
			headerCells,
			bodyCells,
			footerCells,
			tags,
		},
		pluginVersion: CURRENT_PLUGIN_VERSION,
	};
};
