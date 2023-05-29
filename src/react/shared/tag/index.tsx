import Icon from "../icon";
import Stack from "../stack";
import { Color } from "src/shared/types/types";
import { findColorClassName } from "src/shared/color";
import { Button } from "../button";

import "./styles.css";
import { useAppSelector } from "src/redux/global/hooks";
import Padding from "../padding";
interface Props {
	id?: string;
	maxWidth?: string;
	markdown: string;
	color: Color;
	showRemove?: boolean;
	onRemoveClick?: (tagId: string) => void;
	onClick?: (tagId: string) => void;
}

export default function Tag({
	id,
	color,
	maxWidth,
	markdown,
	showRemove,
	onRemoveClick,
}: Props) {
	const { isDarkMode } = useAppSelector((state) => state.global);

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
			<Stack spacing="sm" justify="center">
				<div
					className={contentClassName}
					{...(maxWidth !== undefined && { style: { maxWidth } })}
				>
					{markdown}
				</div>
				{showRemove && (
					<Padding pb="sm" width="max-content">
						<Button
							icon={<Icon size="sm" lucideId="x" />}
							isSimple
							onClick={() => {
								onRemoveClick !== undefined &&
									onRemoveClick(id!);
							}}
						/>
					</Padding>
				)}
			</Stack>
		</div>
	);
}
