import React, { forwardRef } from "react";

import Tag from "../Tag";

import "./styles.css";
interface Props {
	content: string;
	color: string;
	width: string;
	onClick: (e: React.MouseEvent) => void;
	onContextClick: (e: React.MouseEvent) => void;
}

type Ref = HTMLTableCellElement;

const TagCell = forwardRef<Ref, Props>(
	({ content, color, width, onClick, onContextClick }: Props, ref) => {
		return (
			<td
				className="NLT__td NLT__tag-cell"
				ref={ref}
				width={width}
				onClick={onClick}
				onContextMenu={onContextClick}
			>
				<Tag content={content} color={color} />
			</td>
		);
	}
);

export default TagCell;
