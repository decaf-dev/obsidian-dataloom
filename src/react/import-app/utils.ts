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
			return "Paste from clipboard";
		default:
			return "";
	}
};

export const getAcceptForDataType = (value: DataType) => {
	switch (value) {
		case DataType.MARKDOWN:
			return ".md";
		case DataType.CSV:
			return ".csv";
		default:
			return "";
	}
};
