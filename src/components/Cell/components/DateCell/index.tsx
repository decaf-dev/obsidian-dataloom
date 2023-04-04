import { CellType } from "src/services/tableState/types";
import { isValidCellContent } from "src/services/tableState/utils";

import "./styles.css";
interface Props {
	value: string;
}

export default function DateCell({ value }: Props) {
	if (!isValidCellContent(value, CellType.DATE)) value = "";
	return <div className="NLT__date-cell">{value}</div>;
}
