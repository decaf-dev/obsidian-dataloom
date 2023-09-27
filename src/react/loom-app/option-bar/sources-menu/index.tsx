import Menu from "src/react/shared/menu";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";

interface Props {
	id: string;
	isOpen: boolean;
	triggerPosition: Position;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function SourcesMenu({
	id,
	isOpen,
	triggerPosition,
	onRequestClose,
	onClose,
}: Props) {
	return (
		<Menu
			id={id}
			openDirection="bottom-left"
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			onClose={onClose}
		>
			<div>Sources</div>
		</Menu>
	);
}
