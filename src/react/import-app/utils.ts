import { DataSource, DataType } from "./types";

export const getDisplayNameForDataType = (value: DataType) => {
	switch (value) {
		case DataType.UNSELECTED:
			return "Select an option";
		case DataType.MARKDOWN:
			return "Markdown";
		case DataType.CSV:
			return "CSV";
		default:
			return "";
	}
};

export const getDisplayNameForDataSource = (value: DataSource) => {
	switch (value) {
		case DataSource.UNSELECTED:
			return "Select an option";
		case DataSource.FILE:
			return "File";
		case DataSource.COPY_PASTE:
			return "Copy and paste";
		default:
			return "";
	}
};
