import React from "react";
import { useMenuOperations } from "src/react/shared/menu-provider/hooks";
import { useLogger } from "src/shared/logger";

export const useAppEvents = () => {
	const { topMenu, onRequestClose } = useMenuOperations();
	const logger = useLogger();
	const handleClick = React.useCallback(
		(e: React.MouseEvent) => {
			logger("App handleClick");
			e.stopPropagation();

			if (!topMenu) return;
			onRequestClose(topMenu.id, "close-on-save");
		},
		[topMenu, logger, onRequestClose]
	);
	return {
		onClick: handleClick,
	};
};
