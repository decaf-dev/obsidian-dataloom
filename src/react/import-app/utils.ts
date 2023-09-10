import { DataType } from "./types";

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
