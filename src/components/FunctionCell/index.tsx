import { useMenu } from "src/services/menu/hooks";
import Text from "../Text";

import "./styles.css";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { isMenuOpen } from "src/services/menu/utils";
import FunctionMenu from "./components/FunctionMenu";
import {
	BodyCell,
	BodyRow,
	CellType,
	CurrencyType,
	DateFormat,
	FunctionType,
	GeneralFunction,
	Tag,
} from "src/services/tableState/types";
import { closeTopLevelMenu, openMenu } from "src/services/menu/menuSlice";
import Stack from "../Stack";
import {
	getShortDisplayNameForFunctionType,
	isGeneralFunction,
} from "src/services/tableState/utils";
import { getNumberFunctionContent } from "./services/numberFunction";
import { getGeneralFunctionContent } from "./services/generalFunction";

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
	const [menu, menuPosition] = useMenu(MenuLevel.ONE);
	const shouldOpenMenu = useAppSelector((state) =>
		isMenuOpen(state, menu.id)
	);
	const dispatch = useAppDispatch();

	function handleFunctionTypeClick(value: FunctionType) {
		onFunctionTypeChange(cellId, value);
		dispatch(closeTopLevelMenu());
	}

	const { position, positionRef } = menuPosition;
	const { top, left } = position;

	let menuTop = top - 100;
	if (cellType === CellType.NUMBER || cellType === CellType.CURRENCY) {
		menuTop = top - 200;
	}

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
				ref={positionRef}
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
				top={menuTop}
				cellType={cellType}
				left={left + 25}
				isOpen={shouldOpenMenu}
				value={functionType}
				onClick={handleFunctionTypeClick}
			/>
		</>
	);
}
