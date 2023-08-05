import React from "react";

import Input from "src/react/shared/input";

import { useInputSelection } from "src/shared/hooks";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function ExternalEmbedInput({ value, onChange }: Props) {
	const ref = React.useRef<HTMLInputElement | null>(null);

	useInputSelection(ref, value);
	return <Input ref={ref} showBorder value={value} onChange={onChange} />;
}
