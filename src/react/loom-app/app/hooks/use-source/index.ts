import { SourceType } from "src/shared/loom-state/types/loom-state";
import { useLogger } from "src/shared/logger";
import { useLoomState } from "../../../loom-state-provider";
import SourceAddCommand from "src/shared/loom-state/commands/source-add-command";
import SourceDeleteCommand from "src/shared/loom-state/commands/source-delete-command";

export const useSource = () => {
	const logger = useLogger();
	const { doCommand } = useLoomState();

	function handleSourceAdd(type: SourceType, name: string) {
		logger("handleSourceAdd");
		doCommand(new SourceAddCommand(type, name));
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
