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
				className="NLT__td"
				ref={ref}
				style={{ width }}
				onClick={onClick}
				onContextMenu={onContextClick}
			>
				<div className="NLT__tag-cell">
					<Tag content={content} color={color} />
				</div>
			</td>
		);
	}
);

export default TagCell;
