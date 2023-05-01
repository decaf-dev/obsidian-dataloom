import Text from "../shared/Text";
import FunctionMenu from "./components/FunctionMenu";

import { useMenu } from "src/services/menu/hooks";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch } from "src/services/redux/hooks";
import { shiftMenuIntoViewContent } from "src/services/menu/utils";
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
import { closeTopLevelMenu, openMenu } from "src/services/menu/menuSlice";
import Stack from "../shared/Stack";
import {
	getShortDisplayNameForFunctionType,
	isGeneralFunction,
} from "src/services/tableState/utils";
import { getNumberFunctionContent } from "./services/numberFunction";
import { getGeneralFunctionContent } from "./services/generalFunction";

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
				className="NLT__function-cell NLT__selectable"
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
