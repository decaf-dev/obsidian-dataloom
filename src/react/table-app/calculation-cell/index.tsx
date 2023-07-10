import Text from "../../shared/text";
import CalculationMenu from "./calculation-menu";

import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import {
	BodyCell,
	BodyRow,
	Calculation,
	CalculationType,
	CellType,
	CurrencyType,
	DateFormat,
	Tag,
} from "src/shared/types";
import Stack from "../../shared/stack";

import MenuTrigger from "src/react/shared/menu-trigger";
import { isNumber, isNumberCalcuation } from "src/shared/match";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { getShortDisplayNameForCalculationType } from "src/shared/loom-state/display-name";
import { css } from "@emotion/react";
import { getCalculationContent } from "./calculation";
import { getNumberCalculationContent } from "./number-calculation";

interface Props {
	columnId: string;
	cellId: string;
	calculationType: CalculationType;
	columnTags: Tag[];
	bodyRows: BodyRow[];
	bodyCells: BodyCell[];
	currencyType: CurrencyType;
	cellType: CellType;
	dateFormat: DateFormat;
	onTypeChange: (columnId: string, value: CalculationType) => void;
}

export default function CalculationCell({
	columnId,
	columnTags,
	bodyCells,
	dateFormat,
	bodyRows,
	calculationType,
	currencyType,
	cellType,
	onTypeChange,
}: Props) {
	const { menu, isMenuOpen, menuRef, closeTopMenu } = useMenu(MenuLevel.ONE);

	const { triggerPosition, triggerRef } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen);

	function handleTypeClick(value: CalculationType) {
		onTypeChange(columnId, value);
		closeTopMenu();
	}

	const columnCells = bodyCells.filter((cell) => cell.columnId === columnId);

	let content = "";

	if (isNumberCalcuation(calculationType)) {
		const cellValues = columnCells
			.filter((cell) => isNumber(cell.markdown))
			.map((cell) => parseFloat(cell.markdown));
		if (cellValues.length !== 0)
			content = getNumberCalculationContent(
				cellValues,
				cellType,
				currencyType,
				calculationType
			);
	} else {
		content = getCalculationContent(
			bodyRows,
			columnCells,
			columnTags,
			cellType,
			calculationType,
			dateFormat
		);
	}

	return (
		<>
			<MenuTrigger isCell menu={menu}>
				<div
					className="DataLoom__function-cell DataLoom__selectable"
					ref={triggerRef}
					css={css`
						display: flex;
						justify-content: flex-end;
						cursor: pointer;
						overflow: hidden;
						padding: var(--nlt-cell-spacing-x)
							var(--nlt-cell-spacing-y);
					`}
				>
					{calculationType === Calculation.NONE && (
						<Text value="Calculate" variant="faint" />
					)}
					{calculationType !== Calculation.NONE && (
						<Stack spacing="sm" isHorizontal>
							<Text
								value={getShortDisplayNameForCalculationType(
									calculationType
								)}
								variant="muted"
							/>
							<Text value={content} variant="semibold" />
						</Stack>
					)}
				</div>
			</MenuTrigger>
			<CalculationMenu
				id={menu.id}
				top={triggerPosition.top}
				ref={menuRef}
				cellType={cellType}
				left={triggerPosition.left}
				isOpen={isMenuOpen}
				value={calculationType}
				onClick={handleTypeClick}
			/>
		</>
	);
}
