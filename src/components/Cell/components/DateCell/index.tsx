import { CellType } from "src/services/tableState/types";
import { isValidCellContent } from "src/services/tableState/utils";

import "./styles.css";
interface Props {
	content: string;
}

export default function DateCell({ content }: Props) {
	if (!isValidCellContent(content, CellType.DATE)) content = "";
	return <div className="NLT__date-cell">{content}</div>;
}
