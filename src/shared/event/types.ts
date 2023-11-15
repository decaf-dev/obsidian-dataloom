export type DataLoomEvent =
	| "add-column"
	| "delete-column"
	| "add-row"
	| "delete-row"
	| "app-refresh"
	| "file-frontmatter-change"
	| "file-delete"
	| "folder-delete"
	| "folder-rename"
	| "file-rename"
	| "file-create"
	| "global-click"
	| "global-keydown"
	| "download-csv"
	| "download-markdown"
	| "property-type-change";

export type EventCallback = (...data: any[]) => void;
