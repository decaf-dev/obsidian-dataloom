import { IconType } from "src/services/icon/types";

import { findColorClassName } from "src/services/color";

import "./styles.css";
import Icon from "../Icon";
import Button from "../Button";
import Stack from "../Stack";
import { Color } from "src/services/color/types";

interface Props {
	isDarkMode: boolean;
	id?: string;
	width?: string;
	markdown: string;
	color: Color;
	showRemove?: boolean;
	onRemoveClick?: (tagId: string) => void;
	onClick?: (tagId: string) => void;
}

export default function Tag({
	isDarkMode,
	id,
	color,
	width,
	markdown,
	showRemove,
	onRemoveClick,
}: Props) {
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClassName(isDarkMode, color);

	if (onRemoveClick && id == undefined) {
		throw new Error(
			"An id must defined when the onRemoveClick handler is present."
		);
	}

	let contentClassName = "NLT__tag-content";
	if (width !== undefined) {
		contentClassName += " " + "NLT__hide-overflow-ellipsis";
	}
	return (
		<div className={tagClass}>
			<Stack spacing="sm">
				<div
					className={contentClassName}
					{...(width !== undefined && { style: { width } })}
				>
					{markdown}
				</div>
				{showRemove && (
					<Button
						icon={<Icon size="sm" type={IconType.CLOSE} />}
						isDarker
						onClick={() => {
							onRemoveClick !== undefined && onRemoveClick(id!);
						}}
					/>
				)}
			</Stack>
		</div>
	);
}
