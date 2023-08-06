import React from "react";

import Stack from "../stack";
import Icon from "../icon";
import Button from "../button";

import "./styles.css";

interface Props {
	icon?: React.ReactNode;
	canRemove?: boolean;
	value: string;
	onRemoveClick?: () => void;
}

export default function Bubble({
	canRemove,
	icon,
	value,
	onRemoveClick,
}: Props) {
	return (
		<div className="dataloom-bubble">
			<Stack spacing="lg" isHorizontal>
				<Stack spacing="sm" isHorizontal>
					{icon}
					<span>{value}</span>
				</Stack>
				{canRemove && (
					<Button
						isSmall
						invertFocusColor
						icon={
							<Icon lucideId="x" color="var(--text-on-accent)" />
						}
						ariaLabel="Remove sort"
						onClick={onRemoveClick}
					/>
				)}
			</Stack>
		</div>
	);
}
