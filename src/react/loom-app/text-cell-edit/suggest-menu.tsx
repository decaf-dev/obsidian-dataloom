import Menu from "src/react/shared/menu";
import { SuggestList } from "../../shared/suggest-list";
import { TFile } from "obsidian";
import { LoomMenuPosition } from "src/react/shared/menu/types";

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
		<Menu id={id} isOpen={isOpen} position={position} width={275}>
			<SuggestList filterValue={filterValue} onItemClick={onItemClick} />
		</Menu>
	);
}
