import { css } from "@emotion/react";
import Button from "../../shared/button";
import Icon from "src/react/shared/icon";

interface Props {
	onClick: () => void;
}

export default function NewRowButton({ onClick }: Props) {
	return (
		<div
			css={css`
				padding: var(--nlt-spacing--sm) 0;
			`}
		>
			<Button
				icon={<Icon lucideId="plus" />}
				ariaLabel="New row"
				onClick={() => onClick()}
			/>
		</div>
	);
}
