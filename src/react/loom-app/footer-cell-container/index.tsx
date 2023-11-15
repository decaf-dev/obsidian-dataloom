import Text from "../../shared/text";
import CalculationMenu from "./calculation-menu";

import {
	Cell,
	Row,
	GeneralCalculation,
	CalculationType,
	CellType,
	CurrencyType,
	DateFormat,
	Tag,
	NumberFormat,
	Source,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import Stack from "../../shared/stack";

import MenuTrigger from "src/react/shared/menu-trigger";
import { isNumber, isNumberCalcuation } from "src/shared/match";
import { getShortDisplayNameForCalculationType } from "src/shared/loom-state/type-display-names";
import { getGeneralCalculationContent } from "./general-calculation";
import { getNumberCalculationContent } from "./number-calculation";
import { ColumnChangeHandler } from "../app/hooks/use-column/types";

import "./styles.css";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import { useMenu } from "src/react/shared/menu-provider/hooks";

interface Props {
	sources: Source[];
	columnId: string;
	calculationType: CalculationType;
	columnTags: Tag[];
	width: string;
	numberFormat: NumberFormat;
	rows: Row[];
	columnCells: Cell[];
	currencyType: CurrencyType;
	cellType: CellType;
	dateFormat: DateFormat;
	dateFormatSeparator: DateFormatSeparator;
	onColumnChange: ColumnChangeHandler;
}

export default function FooterCellContainer({
	sources,
	columnId,
	columnCells,
	columnTags,
	dateFormat,
	dateFormatSeparator,
	numberFormat,
	rows,
	width,
	calculationType,
	currencyType,
	cellType,
	onColumnChange,
}: Props) {
	const COMPONENT_ID = `footer-cell-${columnId}`;
	const menu = useMenu(COMPONENT_ID);

	function handleTypeClick(value: CalculationType) {
		if (menu === null) return;

		onColumnChange(columnId, {
			calculationType: value,
		});
		menu.onClose();
	}

	let content = "";

	if (isNumberCalcuation(calculationType)) {
		const cellValues = columnCells
			.filter((cell) => isNumber(cell.content))
			.map((cell) => parseFloat(cell.content));
		if (cellValues.length !== 0)
			content = getNumberCalculationContent(
				cellValues,
				numberFormat,
				currencyType,
				calculationType
			);
	} else {
		content = getGeneralCalculationContent(
			columnId,
			sources,
			rows,
			columnTags,
			cellType,
			calculationType,
			dateFormat,
			dateFormatSeparator
		);
	}

	return (
		<>
			<MenuTrigger
				ref={menu.triggerRef}
				menuId={menu.id}
				isFocused={menu.isTriggerFocused}
				level={LoomMenuLevel.ONE}
				variant="cell"
				onOpen={() => menu.onOpen(LoomMenuLevel.ONE)}
			>
				<div
					className="dataloom-cell--footer__container dataloom-selectable"
					style={{
						width,
					}}
				>
					{calculationType === GeneralCalculation.NONE && (
						<Text value="Calculate" variant="faint" />
					)}
					{calculationType !== GeneralCalculation.NONE && (
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
				isOpen={menu.isOpen}
				position={menu.position}
				cellType={cellType}
				value={calculationType}
				onClick={handleTypeClick}
			/>
		</>
	);
}
