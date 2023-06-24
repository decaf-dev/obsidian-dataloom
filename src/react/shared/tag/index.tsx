import { css } from "@emotion/react";

import Icon from "../icon";
import Stack from "../stack";
import Button from "../button";
import Padding from "../padding";

import { Color } from "src/shared/types";
import { findColorClassName } from "src/shared/color";
import { useAppSelector } from "src/redux/global/hooks";

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

	let tagClass = "Dashboards__tag";
	tagClass += " " + findColorClassName(isDarkMode, color);

	if (onRemoveClick !== undefined && id === undefined) {
		throw new Error(
			"An id must defined when the onRemoveClick handler is present."
		);
	}

	let contentClassName = "Dashboards__tag-content";
	if (maxWidth !== undefined) {
		contentClassName += " " + "Dashboards__hide-overflow-ellipsis";
	}
	return (
		<div
			className={tagClass}
			css={css`
				display: flex;
				align-items: center;
				border-radius: 8px;
				padding: var(--nlt-spacing--xs) var(--nlt-spacing--md);
				width: max-content;
				color: var(--text-normal);
			`}
		>
			<Stack spacing="sm" justify="center">
				<div
					className={contentClassName}
					{...(maxWidth !== undefined && { style: { maxWidth } })}
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
