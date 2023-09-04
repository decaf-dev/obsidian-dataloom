import ModalMenu from "src/react/shared/menu/modal-menu";
import {
	LoomMenuCloseRequestType,
	Position,
} from "src/react/shared/menu/types";

interface Props {
	id: string;
	triggerPosition: Position;
	isOpen: boolean;
	onRequestClose: (type: LoomMenuCloseRequestType) => void;
	onClose: () => void;
}

export default function SelectColumnMenu({
	id,
	triggerPosition,
	isOpen,
	onRequestClose,
	onClose,
}: Props) {
	return (
		<ModalMenu
			id={id}
			isOpen={isOpen}
			triggerPosition={triggerPosition}
			onRequestClose={onRequestClose}
			openDirection="bottom-left"
			onClose={onClose}
		>
			<div
				style={{
					width: "200px",
					height: "200px",
				}}
			>
				wtf
			</div>
		</ModalMenu>
	);
}
