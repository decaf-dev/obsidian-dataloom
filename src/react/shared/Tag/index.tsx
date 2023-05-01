import Icon from "../icon";
import Button from "../button";
import Stack from "../stack";
import { Color } from "src/shared/types";
import { IconType } from "src/react/shared/icon/types";
import { findColorClassName } from "src/shared/colors";

import "./styles.css";
interface Props {
	isDarkMode: boolean;
	id?: string;
	maxWidth?: string;
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
	maxWidth,
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
	if (maxWidth !== undefined) {
		contentClassName += " " + "NLT__hide-overflow-ellipsis";
	}
	return (
		<div className={tagClass}>
			<Stack spacing="sm">
				<div
					className={contentClassName}
					{...(maxWidth !== undefined && { style: { maxWidth } })}
				>
					{markdown}
				</div>
				{showRemove && (
					<Button
						icon={<Icon size="sm" type={IconType.CLOSE} />}
						isSimple
						onClick={() => {
							onRemoveClick !== undefined && onRemoveClick(id!);
						}}
					/>
				)}
			</Stack>
		</div>
	);
}
