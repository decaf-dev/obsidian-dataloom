import { transparentInputStyle } from "src/react/loom-app/shared-styles";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function SuggestInput({ value, onChange }: Props) {
	return (
		<div className="dataloom-suggest-input">
			<input
				className="dataloom-focusable"
				type="text"
				css={transparentInputStyle}
				autoFocus
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
}
