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
} from "src/shared/loom-state/types/loom-state";
import Stack from "../../shared/stack";

import MenuTrigger from "src/react/shared/menu-trigger";
import { isNumber, isNumberCalcuation } from "src/shared/match";
import { getShortDisplayNameForCalculationType } from "src/shared/loom-state/type-display-names";
import { getGeneralCalculationContent } from "./general-calculation";
import { getNumberCalculationContent } from "./number-calculation";
import { useMenu } from "../../shared/menu/hooks";

import "./styles.css";

interface Props {
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
	onTypeChange: (columnId: string, value: CalculationType) => void;
}

export default function FooterCellContainer({
	columnId,
	columnCells,
	columnTags,
	dateFormat,
	numberFormat,
	rows,
	width,
	calculationType,
	currencyType,
	cellType,
	onTypeChange,
}: Props) {
	const {
		menu,
		triggerRef,
		triggerPosition,
		isOpen,
		onOpen,
		onClose,
		onRequestClose,
	} = useMenu();

	function handleTypeClick(value: CalculationType) {
		onTypeChange(columnId, value);
		onClose();
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
			rows,
			columnTags,
			cellType,
			calculationType,
			dateFormat
		);
	}

	return (
		<>
			<MenuTrigger menu={menu} isCell ref={triggerRef} onOpen={onOpen}>
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
				isOpen={isOpen}
				triggerPosition={triggerPosition}
				cellType={cellType}
				value={calculationType}
				onClick={handleTypeClick}
				onRequestClose={onRequestClose}
				onClose={onClose}
			/>
		</>
	);
}
