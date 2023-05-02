import Text from "../../shared/text";
import FunctionMenu from "./function-menu";

import { useMenu } from "src/redux/menu/hooks";
import { MenuLevel } from "src/redux/menu/types";
import { useAppDispatch } from "src/redux/global/hooks";
import { shiftMenuIntoViewContent } from "src/redux/menu/utils";
import {
	BodyCell,
	BodyRow,
	CellType,
	CurrencyType,
	DateFormat,
	FunctionType,
	GeneralFunction,
	Tag,
} from "src/data/types";
import { closeTopLevelMenu, openMenu } from "src/redux/menu/menu-slice";
import Stack from "../../shared/stack";
import {
	getShortDisplayNameForFunctionType,
	isGeneralFunction,
} from "src/shared/table-state/utils";
import { getNumberFunctionContent } from "./numberFunction";
import { getGeneralFunctionContent } from "./generalFunction";

import "./styles.css";

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
	const { menu, menuPosition, isMenuOpen } = useMenu(MenuLevel.ONE);
	const dispatch = useAppDispatch();

	function handleFunctionTypeClick(value: FunctionType) {
		onFunctionTypeChange(cellId, value);
		dispatch(closeTopLevelMenu());
	}

	const { top, left } = shiftMenuIntoViewContent(
		menu.id,
		menuPosition.positionRef.current,
		menuPosition.position,
		cellType === CellType.NUMBER || cellType === CellType.CURRENCY
			? -165
			: 0,
		0
	);

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
			.filter((cell) => cell.markdown !== "")
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
			<div
				tabIndex={0}
				className="NLT__function-cell NLT__selectable NLT__focusable"
				style={{
					width,
				}}
				ref={menuPosition.positionRef}
				onClick={() => dispatch(openMenu(menu))}
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
