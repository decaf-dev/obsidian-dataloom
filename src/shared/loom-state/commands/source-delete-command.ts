import { cloneDeep } from "lodash";
import { LoomState } from "../types";
import { Row, Source } from "../types/loom-state";
import LoomStateCommand from "./loom-state-command";

export default class SourceDeleteCommand extends LoomStateCommand {
	private deletedSource: {
		arrIndex: number;
		source: Source;
	};
	private deletedRows: {
		arrIndex: number;
		row: Row;
	}[] = [];

	private id: string;

	constructor(id: string) {
		super();
		this.id = id;
	}

	execute(prevState: LoomState): LoomState {
		super.onExecute();

		const { sources, rows } = prevState.model;
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
		const nextRows = rows.filter((row) => {
			const { sourceId } = row;
			if (sourceId === this.id) {
				this.deletedRows.push({
					arrIndex: rows.indexOf(row),
					row: cloneDeep(row),
				});
				return false;
			}
			return true;
		});

		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
				rows: nextRows,
			},
		};
	}

	undo(prevState: LoomState): LoomState {
		super.onUndo();

		const { sources, rows } = prevState.model;
		const nextSources: Source[] = cloneDeep(sources);
		nextSources.splice(
			this.deletedSource.arrIndex,
			0,
			this.deletedSource.source
		);

		const nextRows: Row[] = cloneDeep(rows);
		this.deletedRows.forEach(({ arrIndex, row }) => {
			nextRows.splice(arrIndex, 0, row);
		});
		return {
			...prevState,
			model: {
				...prevState.model,
				sources: nextSources,
				rows: nextRows,
			},
		};
	}

	redo(prevState: LoomState): LoomState {
		super.onRedo();
		return this.execute(prevState);
	}
}
