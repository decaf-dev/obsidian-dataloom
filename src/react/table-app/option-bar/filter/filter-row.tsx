import Stack from "src/react/shared/stack";
import FilterRowDropdown from "./filter-type-dropdown";
import Icon from "src/react/shared/icon";
import { IconType } from "src/react/shared/icon/types";
import { Button } from "src/react/shared/button";
import Switch from "src/react/shared/switch";
import { css } from "@emotion/react";
import { CellType, FilterType } from "src/data/types";
import FilterColumnDropdown from "./filter-column-dropdown";
import { ColumnData } from "../types";

interface Props {
	id: string;
	columns: ColumnData[];
	isEnabled: boolean;
	columnId: string;
	cellType: CellType;
	filterType: FilterType;
	value: string;
	onToggle: (id: string) => void;
	onColumnChange: (id: string, columnId: string) => void;
	onFilterTypeChange: (id: string, value: FilterType) => void;
	onValueChange: (id: string, value: string) => void;
	onDeleteClick: (id: string) => void;
}

export default function FilterRow({
	id,
	columns,
	isEnabled,
	columnId,
	filterType,
	cellType,
	value,
	onToggle,
	onColumnChange,
	onFilterTypeChange,
	onValueChange,
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
				value={value}
				type="text"
				css={css`
					width: 150px;
				`}
				onChange={(e) => onValueChange(id, e.target.value)}
			/>
			<Button
				icon={<Icon type={IconType.DELETE} />}
				ariaLabel="Delete filter rule"
				onClick={() => onDeleteClick(id)}
			/>
		</Stack>
	);
}
