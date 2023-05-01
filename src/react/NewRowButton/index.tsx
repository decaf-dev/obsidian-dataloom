import Button from "../shared/Button";

import "./styles.css";

interface Props {
	onClick: () => void;
}

export default function NewRowButton({ onClick }: Props) {
	return (
		<div className="NLT__new-row">
			<Button onClick={() => onClick()}>New row</Button>
		</div>
	);
}
