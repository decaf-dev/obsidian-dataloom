import Button from "../button";
import Icon from "../icon";
import Padding from "../padding";
import Stack from "../stack";

import { findColorClassName } from "src/shared/color";
import { Color } from "src/shared/loom-state/types/loom-state";

import "./styles.css";

interface Props {
	id?: string;
	maxWidth?: string;
	content: string;
	color: Color;
	showRemoveButton?: boolean;
	onRemoveClick?: (id: string) => void;
	onClick?: (id: string) => void;
}

export default function Tag({
	id,
	color,
	maxWidth,
	content,
	showRemoveButton,
	onRemoveClick,
}: Props) {
	const isDarkMode = false;
	let tagClassName = "dataloom-tag";
	tagClassName += " " + findColorClassName(isDarkMode, color);

	if (onRemoveClick !== undefined && id === undefined) {
		throw new Error(
			"An id must defined when the onRemoveClick handler is present."
		);
	}

	let contentClassName = "dataloom-tag-content";
	if (maxWidth !== undefined) {
		contentClassName += " " + "dataloom-overflow--ellipsis";
	}
	return (
		<div className={tagClassName}>
			<Stack spacing="sm" justify="center" isHorizontal>
				<div
					className={contentClassName}
					style={{
						maxWidth,
					}}
				>
					{content}
				</div>
				{showRemoveButton && (
					<Padding width="max-content">
						<Button
							size="sm"
							icon={<Icon lucideId="x" />}
							onClick={() => {
								if (id && onRemoveClick) onRemoveClick(id);
							}}
						/>
					</Padding>
				)}
			</Stack>
		</div>
	);
}
