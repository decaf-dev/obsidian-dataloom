import React from "react";
import { useMenuOperations } from "src/react/shared/menu-provider/hooks";
import { useLogger } from "src/shared/logger";

export const useAppEvents = () => {
	const { topMenu, onRequestClose, onClearMenuTriggerFocus } =
		useMenuOperations();
	const logger = useLogger();
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
