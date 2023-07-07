import Button from "../../shared/button";
import Icon from "src/react/shared/icon";

interface Props {
	onClick: () => void;
}

export default function NewRowButton({ onClick }: Props) {
	return (
		<Button
			icon={<Icon lucideId="plus" />}
			ariaLabel="New row"
			onClick={() => onClick()}
		>
			New
		</Button>
	);
}
