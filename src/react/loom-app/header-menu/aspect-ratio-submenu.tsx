import MenuItem from "src/react/shared/menu-item";
import Submenu from "../../shared/submenu";
import { AspectRatio } from "src/shared/loom-state/types/loom-state";

interface Props {
	title: string;
	value: AspectRatio;
	onValueClick: (value: AspectRatio) => void;
	onBackClick: () => void;
}

export default function AspectRatioSubmenu({
	title,
	value,
	onValueClick,
	onBackClick,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			{Object.values(AspectRatio).map((ratio) => (
				<MenuItem
					key={ratio}
					name={ratio}
					onClick={() => onValueClick(ratio)}
					isSelected={ratio === value}
				/>
			))}
		</Submenu>
	);
}
