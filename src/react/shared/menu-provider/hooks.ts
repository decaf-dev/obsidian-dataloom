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
	const { id, isOpen, position, isTriggerFocused, closeRequest } = getMenu(
		parentComponentId,
		name
	);

	const handlePositionUpdate = React.useCallback(
		(newPosition: LoomMenuPosition) => {
			onPositionUpdate(id, newPosition);
		},
		[id, onPositionUpdate]
	);

	const triggerRef = useMenuPosition(
		isOpen,
		isParentObsidianModal,
		handlePositionUpdate
	);

	React.useEffect(
		function focusMenuTrigger() {
			if (!triggerRef.current) return;
			if (!isTriggerFocused) return;

			triggerRef.current?.focus();
		},
		[isTriggerFocused, triggerRef]
	);

	function handleOpen(
		level: LoomMenuLevel,
		options?: {
			shouldRequestOnClose?: boolean;
			shouldFocusTriggerOnClose?: boolean;
		}
	) {
		const { shouldRequestOnClose, shouldFocusTriggerOnClose } =
			options || {};
		onOpen(parentComponentId, level, triggerRef, {
			name,
			shouldRequestOnClose,
			shouldFocusTriggerOnClose,
		});
	}

	const handleClose = React.useCallback(() => {
		if (!isOpen) return;

		onClose(id);
	}, [id, isOpen, onClose]);

	const handleCloseRequestClear = React.useCallback(() => {
		onCloseRequestClear(id);
	}, [id, onCloseRequestClear]);

	return {
		id,
		isOpen,
		closeRequest,
		position,
		triggerRef,
		isTriggerFocused,
		onOpen: handleOpen,
		onClose: handleClose,
		onCloseRequestClear: handleCloseRequestClear,
	};
};

export const useMenuOperations = () => {
	const {
		topMenu,
		canOpen,
		onCloseAll,
		onRequestClose,
		onClose,
		onClearMenuTriggerFocus,
	} = useMenuContext();

	return {
		topMenu,
		canOpen,
		onCloseAll,
		onClose,
		onRequestClose,
		onClearMenuTriggerFocus,
	};
};
