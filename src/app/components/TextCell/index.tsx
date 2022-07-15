import React, { forwardRef, Ref } from "react";

import parse from "html-react-parser";
import {
	parseFileLinks,
	parseURLs,
	parseBoldMarkdown,
	parseItalicMarkdown,
	parseHighlightMarkdown,
} from "src/app/services/string/parsers";
interface Props {
	text: string;
	width: string;
	onClick: (e: React.MouseEvent) => void;
	onContextClick: (e: React.MouseEvent) => void;
}

type Ref = HTMLTableCellElement;

const TextCell = forwardRef<Ref, Props>(
	({ text, width, onClick, onContextClick }, ref) => {
		text = parseURLs(text);
		text = parseFileLinks(text);
		text = parseBoldMarkdown(text);
		text = parseItalicMarkdown(text);
		text = parseHighlightMarkdown(text);

		return (
			<td
				className="NLT__td"
				ref={ref}
				style={{ width }}
				onClick={onClick}
				onContextMenu={onContextClick}
			>
				<div className="NLT__text-cell">{parse(text)}</div>
			</td>
		);
	}
);

export default TextCell;
