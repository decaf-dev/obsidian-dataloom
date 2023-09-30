import { SourceType } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../../loom-state-provider";
import SourceAddCommand from "src/shared/loom-state/commands/source-add-command";
import SourceDeleteCommand from "src/shared/loom-state/commands/source-delete-command";
import { useAppMount } from "src/react/loom-app/app-mount-provider";

export const useSource = () => {
	const logger = useLogger();
	const { app } = useAppMount();
	const { doCommand } = useLoomState();

	function handleSourceAdd(type: SourceType, name: string) {
		logger("handleSourceAdd");
		doCommand(new SourceAddCommand(app, type, name));
	}

	function handleSourceDelete(id: string) {
		logger("handleSourceDelete", { id });
		doCommand(new SourceDeleteCommand(id));
	}

	return {
		onSourceAdd: handleSourceAdd,
		onSourceDelete: handleSourceDelete,
	};
};
