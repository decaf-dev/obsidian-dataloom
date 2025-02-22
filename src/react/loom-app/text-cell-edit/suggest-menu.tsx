import { TFile } from "obsidian";
import Menu from "src/react/shared/menu";
import { type LoomMenuPosition } from "src/react/shared/menu/types";
import { SuggestList } from "../../shared/suggest-list";

interface Props {
	id: string;
	isOpen: boolean;
	position: LoomMenuPosition;
	filterValue: string;
	onItemClick: (item: TFile | null) => void;
}

export default function SuggestMenu({
	id,
	isOpen,
	position,
	filterValue,
	onItemClick,
}: Props) {
	return (
		<Menu
			id={id}
			isOpen={isOpen}
			position={position}
			width={275}
			topOffset={30}
			leftOffset={30}
		>
			<SuggestList filterValue={filterValue} onItemClick={onItemClick} />
		</Menu>
	);
}
