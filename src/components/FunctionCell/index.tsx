import { useMenu } from "src/services/menu/hooks";
import Text from "../Text";

import "./styles.css";
import { MenuLevel } from "src/services/menu/types";
import { useAppDispatch, useAppSelector } from "src/services/redux/hooks";
import { isMenuOpen } from "src/services/menu/utils";
import FunctionMenu from "./components/FunctionMenu";
import {
	CellType,
	FunctionType,
	GeneralFunction,
	NumberFunction,
} from "src/services/tableState/types";
import { closeTopLevelMenu, openMenu } from "src/services/menu/menuSlice";
import Stack from "../Stack";
import { getDisplayNameForFunctionType } from "src/services/tableState/utils";

interface Props {
	cellId: string;
	value: FunctionType;
	cellType: CellType;
	onClick: (cellId: string, value: FunctionType) => void;
}

export default function FunctionCell({
	cellId,
	value,
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

	let content = "25";
	if (value === GeneralFunction.COUNT_ALL) {
	} else if (value === GeneralFunction.COUNT_EMPTY) {
	} else if (value === GeneralFunction.COUNT_NOT_EMPTY) {
	} else if (value === GeneralFunction.COUNT_UNIQUE) {
	} else if (value === GeneralFunction.COUNT_VALUES) {
	} else if (value === GeneralFunction.PERCENT_EMPTY) {
	} else if (value === GeneralFunction.PERCENT_NOT_EMPTY) {
	} else if (value === NumberFunction.AVG) {
	} else if (value === NumberFunction.MAX) {
	} else if (value === NumberFunction.MIN) {
	} else if (value === NumberFunction.RANGE) {
	} else if (value === NumberFunction.SUM) {
	} else if (value === NumberFunction.MEDIAN) {
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
							value={getDisplayNameForFunctionType(value)}
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
