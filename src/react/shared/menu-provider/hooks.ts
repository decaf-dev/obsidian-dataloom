import React from "react";
import { useMenuContext } from ".";
import { useMenuPosition } from "../menu/hooks";
import { LoomMenuLevel } from "./types";

export const useMenu = (parentComponentId: string, name?: string) => {
	const { onOpen, getMenu, onClose, onPositionUpdate } = useMenuContext();
	const { id, isOpen, position, closeRequest } = getMenu(
		parentComponentId,
		name
	);
	const menuPosition = useMenuPosition(isOpen);

	// React.useEffect(() => {
	// 	if (!isOpen) return;

	// 	const { top, left } = menuPosition.position;
	// 	if (top !== 0 && left !== 0) {
	// 		onPositionUpdate(id, menuPosition.position);
	// 	}
	// }, [onPositionUpdate, id, menuPosition.position, isOpen]);

	function handleOpen(
		level: LoomMenuLevel,
		options?: { shouldRequestOnClose?: boolean }
	) {
		const { shouldRequestOnClose } = options || {};
		onOpen(parentComponentId, level, menuPosition.ref, {
			name,
			shouldRequestOnClose,
		});
	}

	function handleClose() {
		onClose(id);
	}

	return {
		id,
		isOpen,
		closeRequest,
		position,
		positionRef: menuPosition.ref,
		onOpen: handleOpen,
		onClose: handleClose,
	};
};

export const useMenuOperations = () => {
	const { topMenu, onCloseAll, onRequestClose, onClose } = useMenuContext();

	return {
		topMenu,
		onCloseAll,
		onClose,
		onRequestClose,
	};
};
