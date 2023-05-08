import Stack from "src/react/shared/stack";
import FilterRowDropdown from "./filter-type-dropdown";
import Icon from "src/react/shared/icon";
import { IconType } from "src/react/shared/icon/types";
import { Button } from "src/react/shared/button";
import Switch from "src/react/shared/switch";
import { css } from "@emotion/react";
import { CellType, FilterType } from "src/data/types";
import FilterColumnDropdown from "./filter-column-dropdown";
import { ColumnFilter } from "../types";

interface Props {
	id: string;
	columns: ColumnFilter[];
	isEnabled: boolean;
	columnId: string;
	cellType: CellType;
	filterType: FilterType;
	text: string;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterTypeChange: (id: string, value: FilterType) => void;
	onTextChange: (id: string, value: string) => void;
	onDeleteClick: (id: string) => void;
}

export default function FilterRow({
	id,
	columns,
	isEnabled,
	columnId,
	filterType,
	cellType,
	text,
	onToggle,
	onColumnChange,
	onFilterTypeChange,
	onTextChange,
	onDeleteClick,
}: Props) {
	return (
		<Stack>
			<Switch
				isChecked={isEnabled}
				ariaLabel={
					isEnabled ? "Disable filter rule" : "Enable filter rule"
				}
				onToggle={() => onToggle(id)}
			/>
			<FilterColumnDropdown
				id={id}
				columns={columns}
				value={columnId}
				onChange={onColumnChange}
			/>
			<FilterRowDropdown
				id={id}
				cellType={cellType}
				value={filterType}
				onChange={onFilterTypeChange}
			/>
			<input
				value={text}
				type="text"
				css={css`
					width: 150px;
				`}
				onChange={(e) => onTextChange(id, e.target.value)}
			/>
			<Button
				icon={<Icon type={IconType.DELETE} />}
				ariaLabel="Delete filter rule"
				onClick={() => onDeleteClick(id)}
			/>
		</Stack>
	);
}
