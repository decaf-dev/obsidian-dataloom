import { useOverflow } from "src/shared/spacing/hooks";

import { isNumber } from "src/shared/match";
import {
	CurrencyType,
	NumberFormat,
} from "src/shared/loom-state/types/loom-state";
import { getNumberCellContent } from "src/shared/cell-content/number-cell-content";
import "./styles.css";

interface Props {
	getValueByColName: (name: string) => string|undefined // @TODO Type RowValues
	formula: string // @TODO Type Formalu
}

export default function FormulaCell({
	getValueByColName, formula
}: Props) {
	console.log("🚀 ~ file: index.tsx:23 ~ formula:", formula)
	const overflowClassName = useOverflow(false);
	let calculatedValue = ''

	calculatedValue = formula.split(' + ').map(colName => getValueByColName(colName)).join('+')

	let className = "dataloom-number-cell";
	className += " " + overflowClassName;

	return <div className={className}>{calculatedValue}</div>;
}
