import Logger from "js-logger";
import React from "react";
import { useMenuOperations } from "src/react/shared/menu-provider/hooks";

export const useAppEvents = () => {
	const { topMenu, onRequestClose, onClearMenuTriggerFocus } =
		useMenuOperations();
	const handleClick = React.useCallback(
		(e: React.MouseEvent) => {
			Logger.trace("App handleClick");
			e.stopPropagation();

			if (!topMenu) {
				onClearMenuTriggerFocus();
				return;
			}
			onRequestClose(topMenu.id, "save-and-close");
		},
		[topMenu, onRequestClose, onClearMenuTriggerFocus]
	);
	return {
		onClick: handleClick,
	};
};
