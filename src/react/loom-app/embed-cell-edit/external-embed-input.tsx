import React from "react";

import Input from "src/react/shared/input";

import { usePlaceCursorAtEnd } from "src/shared/hooks";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function ExternalEmbedInput({ value, onChange }: Props) {
	const ref = React.useRef<HTMLInputElement | null>(null);

	usePlaceCursorAtEnd(ref, value);
	return (
		<Input
			ref={ref}
			showBorder
			placeholder="Enter a url"
			value={value}
			onChange={onChange}
		/>
	);
}
