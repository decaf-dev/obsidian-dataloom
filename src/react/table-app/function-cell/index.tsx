import Text from "../../shared/text";
import FunctionMenu from "./function-menu";

import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import {
	BodyCell,
	BodyRow,
	CellType,
	CurrencyType,
	DateFormat,
	FunctionType,
	GeneralFunction,
	Tag,
} from "src/shared/types/types";
import Stack from "../../shared/stack";
import { getNumberFunctionContent } from "./number-function";
import { getGeneralFunctionContent } from "./general-function";

import "./styles.css";
import MenuTrigger from "src/react/shared/menu-trigger";
import { isGeneralFunction, isNumber } from "src/shared/validators";
import { getShortDisplayNameForFunctionType } from "src/shared/table-state/display-name";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";

interface Props {
	columnId: string;
	cellId: string;
	functionType: FunctionType;
	columnTags: Tag[];
	bodyRows: BodyRow[];
	bodyCells: BodyCell[];
	currencyType: CurrencyType;
	cellType: CellType;
	dateFormat: DateFormat;
	onFunctionTypeChange: (columnId: string, value: FunctionType) => void;
}

export default function FunctionCell({
	columnId,
	columnTags,
	bodyCells,
	dateFormat,
	bodyRows,
	functionType,
	currencyType,
	cellType,
	onFunctionTypeChange,
}: Props) {
	const { menu, isMenuOpen, menuRef, closeTopMenu } = useMenu(MenuLevel.ONE);

	const { triggerPosition, triggerRef } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen);

	function handleFunctionTypeClick(value: FunctionType) {
		onFunctionTypeChange(columnId, value);
		closeTopMenu();
	}

	const columnCells = bodyCells.filter((cell) => cell.columnId === columnId);

	let content = "";

	if (isGeneralFunction(functionType)) {
		content = getGeneralFunctionContent(
			bodyRows,
			columnCells,
			columnTags,
			cellType,
			functionType,
			dateFormat
		);
	} else {
		const cellValues = columnCells
			.filter((cell) => isNumber(cell.markdown))
			.map((cell) => parseFloat(cell.markdown));
		if (cellValues.length !== 0)
			content = getNumberFunctionContent(
				cellValues,
				cellType,
				currencyType,
				functionType
			);
	}

	return (
		<>
			<MenuTrigger menu={menu}>
				<div
					className="NLT__function-cell NLT__selectable"
					ref={triggerRef}
				>
					{functionType === GeneralFunction.NONE && (
						<Text value="Calculate" variant="faint" />
					)}
					{functionType !== GeneralFunction.NONE && (
						<Stack spacing="sm">
							<Text
								value={getShortDisplayNameForFunctionType(
									functionType
								)}
								variant="muted"
							/>
							<Text value={content} variant="semibold" />
						</Stack>
					)}
				</div>
			</MenuTrigger>
			<FunctionMenu
				id={menu.id}
				top={triggerPosition.top}
				ref={menuRef}
				cellType={cellType}
				left={triggerPosition.left}
				isOpen={isMenuOpen}
				value={functionType}
				onClick={handleFunctionTypeClick}
			/>
		</>
	);
}
