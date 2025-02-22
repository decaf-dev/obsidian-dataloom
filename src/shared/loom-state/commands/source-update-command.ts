import { type LoomState, type Source } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class SourceUpdateCommand<
	T extends Source
> extends LoomStateCommand {
	private id: string;
	private data: Partial<T>;
	private isPartial: boolean;

	constructor(id: string, data: Partial<T>, isPartial = true) {
		super(false);
		this.id = id;
		this.data = data;
		this.isPartial = isPartial;
	}

	execute(prevState: LoomState): LoomState {
		const { sources } = prevState.model;
		const nextSources = sources.map((source) => {
			if (source.id === this.id) {
				let newSource: T = this.data as T;
				if (this.isPartial)
					newSource = { ...source, ...this.data } as T;
				return newSource;
			}
			return source;
		});

		const nextState = {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
			},
		};
		this.finishExecute(prevState, nextState);
		return nextState;
	}
}
