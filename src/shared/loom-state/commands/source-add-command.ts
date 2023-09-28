import { createSource } from "../loom-state-factory";
import { LoomState } from "../types";
import { Source, SourceType } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class SourceAddCommand extends LoomStateCommand {
	private name: string;
	private type: SourceType;

	private addedSource: Source;

	constructor(type: SourceType, name: string) {
		super();
		this.type = type;
		this.name = name;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { sources } = prevState.model;

		const newSource = createSource(this.name, this.type);
		this.addedSource = newSource;
		const nextSources = [...sources, newSource];

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

		const nextSources = sources.filter(
			(source) => source.id !== this.addedSource.id
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

		const { sources } = prevState.model;
		const nextSources = [...sources, this.addedSource];

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
			},
		};
	}
}
