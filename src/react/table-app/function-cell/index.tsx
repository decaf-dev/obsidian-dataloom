import Text from "../../shared/text";
import FunctionMenu from "./function-menu";

import { useMenu } from "src/shared/menu/hooks";
import { MenuLevel } from "src/shared/menu/types";
import { shiftMenuIntoViewContent } from "src/shared/menu/utils";
import {
	BodyCell,
	BodyRow,
	CellType,
	CurrencyType,
	DateFormat,
	FunctionType,
	GeneralFunction,
	Tag,
} from "src/shared/table-state/types";
import Stack from "../../shared/stack";
import { getNumberFunctionContent } from "./number-function";
import { getGeneralFunctionContent } from "./general-function";

import "./styles.css";
import MenuTrigger from "src/react/shared/menu-trigger";
import { isGeneralFunction, isNumber } from "src/shared/validators";
import { getShortDisplayNameForFunctionType } from "src/shared/table-state/display-name";

interface Props {
	columnId: string;
	cellId: string;
	width: string;
	functionType: FunctionType;
	tags: Tag[];
	bodyRows: BodyRow[];
	bodyCells: BodyCell[];
	currencyType: CurrencyType;
	cellType: CellType;
	dateFormat: DateFormat;
	onFunctionTypeChange: (cellId: string, value: FunctionType) => void;
}

export default function FunctionCell({
	columnId,
	cellId,
	width,
	tags,
	bodyCells,
	dateFormat,
	bodyRows,
	functionType,
	currencyType,
	cellType,
	onFunctionTypeChange,
}: Props) {
	const { menu, menuPosition, isMenuOpen, openMenu, closeTopMenu } = useMenu(
		MenuLevel.ONE
	);

	function handleFunctionTypeClick(value: FunctionType) {
		onFunctionTypeChange(cellId, value);
		closeTopMenu();
	}

	const { top, left } = shiftMenuIntoViewContent({
		menuId: menu.id,
		menuPositionEl: menuPosition.positionRef.current,
		menuPosition: menuPosition.position,
		topOffset:
			cellType === CellType.NUMBER || cellType === CellType.CURRENCY
				? -165
				: 0,
	});

	const columnCells = bodyCells.filter((cell) => cell.columnId === columnId);

	let content = "";

	if (isGeneralFunction(functionType)) {
		const columnTags = tags.filter((tag) => tag.columnId === columnId);
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
			<MenuTrigger menuId={menu.id} onClick={() => openMenu(menu)}>
				<div
					className="NLT__function-cell NLT__selectable"
					style={{
						width,
					}}
					ref={menuPosition.positionRef}
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
				top={top}
				cellType={cellType}
				left={left}
				isOpen={isMenuOpen}
				value={functionType}
				onClick={handleFunctionTypeClick}
			/>
		</>
	);
}
