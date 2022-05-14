export interface AppSaveState {
	headers: {
		[columnId: string]: {
			width: string;
			sortName: string;
			tags: {
				[content: string]: {
					color: string;
				};
			};
		};
	};
	rows: { [rowId: string]: { creationTime: number } };
}
