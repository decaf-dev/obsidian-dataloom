import { isCheckboxChecked } from "src/shared/match";
import { css } from "@emotion/react";

interface Props {
	value: string;
}

export default function CheckboxCell({ value }: Props) {
	const isChecked = isCheckboxChecked(value);

	return (
		<div
			className="DataLoom__checkbox-cell"
			css={css`
				width: 100%;
				padding: var(--nlt-cell-spacing);
			`}
		>
			<input
				className="task-list-item-checkbox"
				css={css`
					cursor: pointer;
				`}
				type="checkbox"
				checked={isChecked}
				onChange={() => {}}
			/>
		</div>
	);
}
