import MenuItem from "src/react/shared/menu-item";
import Divider from "../divider";

interface Props {
	value: string;
	onClick?: (value: string) => void;
}

export default function CreateButton({ value, onClick }: Props) {
	return (
		<>
			<MenuItem
				name={`Create ${value}`}
				onClick={() => onClick?.(value)}
			/>
			<Divider />
		</>
	);
}
