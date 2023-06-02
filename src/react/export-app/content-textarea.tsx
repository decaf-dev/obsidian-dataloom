import { css } from "@emotion/react";

interface Props {
	value: string;
}

export default function ContentTextArea({ value }: Props) {
	return (
		<textarea
			readOnly
			css={css`
				width: 100%;
				height: 200px;
				resize: vertical;
			`}
			value={value}
		/>
	);
}
