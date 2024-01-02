import React from "react";
import { useMenuOperations } from "src/react/shared/menu-provider/hooks";

export const useAppEvents = () => {
	const { topMenu, onRequestClose, onClearMenuTriggerFocus } =
		useMenuOperations();
	const handleClick = React.useCallback(
		(e: React.MouseEvent) => {
			logger("App handleClick");
			e.stopPropagation();

			if (!topMenu) {
				onClearMenuTriggerFocus();
				return;
			}
			onRequestClose(topMenu.id, "save-and-close");
		},
		[topMenu, logger, onRequestClose, onClearMenuTriggerFocus]
	);
	return {
		onClick: handleClick,
	};
};
