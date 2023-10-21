import React from "react";
import { useMenuContext } from ".";
import { useMenuPosition } from "../menu/hooks";
import { LoomMenuLevel } from "./types";

export const useMenu = (
	parentComponentId: string,
	options?: {
		name?: string;
		isParentObsidianModal?: boolean;
	}
) => {
	const { name, isParentObsidianModal = false } = options || {};
	const { onOpen, getMenu, onClose, onPositionUpdate, onCloseRequestClear } =
		useMenuContext();
	const { id, isOpen, position, closeRequest } = getMenu(
		parentComponentId,
		name
	);
	const menuPosition = useMenuPosition(isOpen, isParentObsidianModal);

	React.useEffect(() => {
		const { top, left } = menuPosition.position;
		if (top !== 0 && left !== 0) {
			onPositionUpdate(id, menuPosition.position);
		}
	}, [onPositionUpdate, id, menuPosition.position]);

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

	const handleClose = React.useCallback(() => {
		onClose(id);
	}, [id, onClose]);

	const handleCloseRequestClear = React.useCallback(() => {
		onCloseRequestClear(id);
	}, [id, onCloseRequestClear]);

	return {
		id,
		isOpen,
		closeRequest,
		position,
		positionRef: menuPosition.ref,
		onOpen: handleOpen,
		onClose: handleClose,
		onCloseRequestClear: handleCloseRequestClear,
	};
};

export const useMenuOperations = () => {
	const { topMenu, canOpen, onCloseAll, onRequestClose, onClose } =
		useMenuContext();

	return {
		topMenu,
		canOpen,
		onCloseAll,
		onClose,
		onRequestClose,
	};
};
