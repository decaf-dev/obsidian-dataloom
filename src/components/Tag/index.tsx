import { IconType } from "src/services/icon/types";

import { findColorClass } from "src/services/color";

import "./styles.css";
import Icon from "../Icon";
import Button from "../Button";
import Stack from "../Stack";

interface Props {
	isDarkMode: boolean;
	id?: string;
	markdown: string;
	color: string;
	showRemove?: boolean;
	onRemoveClick?: (tagId: string) => void;
	onClick?: (tagId: string) => void;
}

export default function Tag({
	isDarkMode,
	id,
	color,
	markdown,
	showRemove,
	onRemoveClick,
}: Props) {
	let tagClass = "NLT__tag";
	tagClass += " " + findColorClass(isDarkMode, color);

	if (onRemoveClick && id == undefined) {
		throw new Error(
			"An id must defined when the onRemoveClick handler is present."
		);
	}

	//TODO add
	markdown;
	return (
		<div className={tagClass}>
			<Stack spacing="sm">
				<div className="NLT__tag-content"></div>
				{showRemove && (
					<Button
						icon={<Icon size="sm" type={IconType.CLOSE} />}
						isDarker
						onClick={(e) => {
							e.stopPropagation();
							onRemoveClick && onRemoveClick(id!);
						}}
					/>
				)}
			</Stack>
		</div>
	);
}
