import Input from "../../input";

interface Props {
	value: string;
	onChange: (value: string) => void;
}

export default function SuggestInput({ value, onChange }: Props) {
	return (
		<div className="dataloom-suggest-input">
			<Input showBorder value={value} onChange={onChange} />
		</div>
	);
}
