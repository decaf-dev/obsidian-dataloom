import React from "react";
import { useMenuContext } from ".";
import { useMenuPosition } from "../menu/hooks";
import { LoomMenuLevel } from "./types";
import { LoomMenuPosition } from "../menu/types";

export const useMenu = (
	parentComponentId: string,
	options?: {
		name?: string;
		isParentObsidianModal?: boolean;
	}
) => {
	const { name, isParentObsidianModal = false } = options || {};
	const { onOpen, getMenu, onClose, onCloseRequestClear, onPositionUpdate } =
		useMenuContext();
	const { id, isOpen, position, closeRequest } = getMenu(
		parentComponentId,
		name
	);

	const handlePositionUpdate = React.useCallback(
		(newPosition: LoomMenuPosition) => {
			onPositionUpdate(id, newPosition);
		},
		[id, onPositionUpdate]
	);

	const positionRef = useMenuPosition(
		isOpen,
		isParentObsidianModal,
		handlePositionUpdate
	);

	function handleOpen(
		level: LoomMenuLevel,
		options?: { shouldRequestOnClose?: boolean }
	) {
		const { shouldRequestOnClose } = options || {};
		onOpen(parentComponentId, level, positionRef, {
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
		positionRef: positionRef,
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
