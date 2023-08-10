import Menu from "src/react/shared/menu";
import { SuggestList } from "../../shared/suggest-list";
import { TFile } from "obsidian";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";

interface Props {
	id: string;
	isOpen: boolean;
	triggerPosition: Position;
	filterValue: string;
	onItemClick: (item: TFile | null) => void;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function SuggestMenu({
	id,
	isOpen,
	triggerPosition,
	filterValue,
	onItemClick,
	onRequestClose,
	onClose,
}: Props) {
	return (
		<Menu
			id={id}
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			width={275}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<SuggestList filterValue={filterValue} onItemClick={onItemClick} />
		</Menu>
	);
}
