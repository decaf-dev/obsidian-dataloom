import Divider from "../divider";
import MenuItem from "../menu-item";

interface Props {
	onClick?: () => void;
}

export default function ClearButton({ onClick }: Props) {
	return (
		<>
			<Divider />
			<MenuItem name="Clear" onClick={onClick} />
		</>
	);
}
