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
	FunctionType,
	GeneralFunction,
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
	value: FunctionType;
	bodyRows: BodyRow[];
	bodyCells: BodyCell[];
	currencyType: CurrencyType;
	cellType: CellType;
	onClick: (cellId: string, value: FunctionType) => void;
}

export default function FunctionCell({
	columnId,
	cellId,
	bodyCells,
	bodyRows,
	value,
	currencyType,
	cellType,
	onClick,
}: Props) {
	const [menu, menuPosition] = useMenu(MenuLevel.ONE);
	const shouldOpenMenu = useAppSelector((state) =>
		isMenuOpen(state, menu.id)
	);
	const dispatch = useAppDispatch();

	function handleClick(value: FunctionType) {
		onClick(cellId, value);
		dispatch(closeTopLevelMenu());
	}

	const { position, containerRef } = menuPosition;
	const { top, left } = position;

	let menuTop = top - 100;
	if (cellType === CellType.NUMBER || cellType === CellType.CURRENCY) {
		menuTop = top - 200;
	}

	const columnCells = bodyCells.filter((cell) => cell.columnId === columnId);

	let content = "";

	if (isGeneralFunction(value)) {
		content = getGeneralFunctionContent(
			bodyRows,
			columnCells,
			cellType,
			value
		);
	} else {
		const cellValues = columnCells
			.filter((cell) => cell.markdown !== "")
			.map((cell) => parseFloat(cell.markdown));
		content = getNumberFunctionContent(
			cellValues,
			cellType,
			currencyType,
			value
		);
	}

	return (
		<>
			<div
				className="NLT__function-cell NLT__selectable"
				ref={containerRef}
				onClick={() => dispatch(openMenu(menu))}
			>
				{value === GeneralFunction.NONE && (
					<Text value="Calculate" variant="faint" />
				)}
				{value !== GeneralFunction.NONE && (
					<Stack spacing="sm">
						<Text
							value={getShortDisplayNameForFunctionType(value)}
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
				value={value}
				onClick={handleClick}
			/>
		</>
	);
}
