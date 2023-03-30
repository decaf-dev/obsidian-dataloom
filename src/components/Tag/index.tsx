import parse from "html-react-parser";
import { IconType } from "src/services/icon/types";

import { findColorClass } from "src/services/color";

import "./styles.css";
import Icon from "../Icon";
import Button from "../Button";
import Stack from "../Stack";

interface Props {
	isDarkMode: boolean;
	id?: string;
	html: string;
	color: string;
	showRemove?: boolean;
	onRemoveClick?: (tagId: string) => void;
	onClick?: (tagId: string) => void;
}

export default function Tag({
	isDarkMode,
	id,
	color,
	html,
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

	return (
		<div className={tagClass}>
			<Stack spacing="sm">
				<div className="NLT__tag-content">{parse(html)}</div>
				{showRemove && (
					<Button
						icon={<Icon variant="sm" icon={IconType.CLOSE} />}
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
