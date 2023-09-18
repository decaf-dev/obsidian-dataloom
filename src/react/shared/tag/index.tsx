import Icon from "../icon";
import Stack from "../stack";
import Button from "../button";
import Padding from "../padding";

import { Color } from "src/shared/loom-state/types/loom-state";
import { findColorClassName } from "src/shared/color";
import { useAppSelector } from "src/redux/hooks";

import "./styles.css";

interface Props {
	id?: string;
	maxWidth?: string;
	markdown: string;
	color: Color;
	showRemoveButton?: boolean;
	onRemoveClick?: (id: string) => void;
	onClick?: (id: string) => void;
}

export default function Tag({
	id,
	color,
	maxWidth,
	markdown,
	showRemoveButton,
	onRemoveClick,
}: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);

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
					{markdown}
				</div>
				{showRemoveButton && (
					<Padding width="max-content">
						<Button
							isSmall
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
