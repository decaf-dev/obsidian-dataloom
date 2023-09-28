import { cloneDeep } from "lodash";
import { LoomState } from "../types";
import { Source } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class SourceDeleteCommand extends LoomStateCommand {
	private deletedSource: {
		arrIndex: number;
		source: Source;
	};
	private id: string;

	constructor(id: string) {
		super();
		this.id = id;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { sources } = prevState.model;
		const nextSources: Source[] = sources.filter((source) => {
			if (source.id === this.id) {
				this.deletedSource = {
					arrIndex: sources.indexOf(source),
					source: cloneDeep(source),
				};
				return false;
			}
			return true;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { sources } = prevState.model;
		const nextSources: Source[] = cloneDeep(sources);
		nextSources.splice(
			this.deletedSource.arrIndex,
			0,
			this.deletedSource.source
		);
		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}
}
