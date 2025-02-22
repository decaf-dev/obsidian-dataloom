import Text from "../../shared/text";
import CalculationMenu from "./calculation-menu";

import {
	CellType,
	CurrencyType,
	DateFormat,
	DateFormatSeparator,
	GeneralCalculation,
	NumberFormat,
	type CalculationType,
	type Cell,
	type NumberCell,
	type Row,
	type Source,
	type Tag,
} from "src/shared/loom-state/types/loom-state";
import Stack from "../../shared/stack";

import MenuTrigger from "src/react/shared/menu-trigger";
import { getShortDisplayNameForCalculationType } from "src/shared/loom-state/type-display-names";
import { isNumberCalcuation } from "src/shared/match";
import type { ColumnChangeHandler } from "../app/hooks/use-column/types";
import { getGeneralCalculationContent } from "./general-calculation";
import { getNumberCalculationContent } from "./number-calculation";

import { useMenu } from "src/react/shared/menu-provider/hooks";
import { LoomMenuLevel } from "src/react/shared/menu-provider/types";
import "./styles.css";

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
		//This assumes that a number calculation will only be used on a column with number cells
		const values: number[] = columnCells
			.map((cell) => (cell as NumberCell).value)
			.filter((value): value is number => value !== null);

		content = getNumberCalculationContent(
			values,
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
