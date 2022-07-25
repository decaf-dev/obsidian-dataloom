import React from "react";

import BaseTable from "./components";
import Button from "src/app/components/Button";

import { TableComponent } from "src/app/services/table";
import { useId } from "src/app/services/hooks";

interface Props {
	headers: TableComponent[];
	rows: TableComponent[];
	footers?: TableComponent[];
	onAddColumn: () => void;
	onAddRow: () => void;
}

const NewColumnButton = ({ onAddNew }: { onAddNew: () => void }) => {
	return (
		<th className="NLT__th" style={{ height: "1.8rem" }}>
			<div className="NLT__th-container" style={{ paddingLeft: "10px" }}>
				<Button onClick={() => onAddNew()}>New</Button>
			</div>
		</th>
	);
};

const NewRowButton = ({ onAddNew }: { onAddNew: () => void }) => {
	return (
		<td className="NLT__td">
			<div className="NLT__td-container">
				<Button onClick={() => onAddNew()}>New</Button>
			</div>
		</td>
	);
};

const EmptyCell = () => {
	return <td className="NLT__td" />;
};

export default function Table({
	headers,
	rows,
	footers = [],
	onAddColumn,
	onAddRow,
}: Props) {
	const columnButtonId = useId();
	const rowButtonId = useId();

	function renderNewColumnButton(onAddColumn: () => void): TableComponent {
		return {
			id: columnButtonId,
			component: <NewColumnButton onAddNew={onAddColumn} />,
		};
	}

	function renderNewRowButton(onAddRow: () => void): TableComponent {
		return {
			id: rowButtonId,
			component: <NewRowButton onAddNew={onAddRow} />,
		};
	}

	function renderEmptyCells(headers: TableComponent[]): TableComponent[] {
		return headers.map((header) => {
			return {
				id: header.id,
				component: <EmptyCell />,
			};
		});
	}

	return (
		<BaseTable
			headers={[...headers, renderNewColumnButton(onAddColumn)]}
			rows={rows}
			footers={[
				...footers,
				renderNewRowButton(onAddRow),
				...renderEmptyCells(headers),
			]}
		/>
	);
}
