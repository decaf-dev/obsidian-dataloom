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
import { getCalculationContent } from "./calculation";
import { getNumberCalculationContent } from "./number-calculation";

import "./styles.css";

interface Props {
	columnId: string;
	cellId: string;
	calculationType: CalculationType;
	columnTags: Tag[];
	width: string;
	bodyRows: BodyRow[];
	bodyCells: BodyCell[];
	currencyType: CurrencyType;
	cellType: CellType;
	dateFormat: DateFormat;
	onTypeChange: (columnId: string, value: CalculationType) => void;
}

export default function FooterCellContainer({
	columnId,
	columnTags,
	bodyCells,
	dateFormat,
	bodyRows,
	width,
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
					className="dataloom-cell--footer__container dataloom-selectable"
					ref={triggerRef}
					style={{
						width,
					}}
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
