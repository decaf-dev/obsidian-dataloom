import Text from "src/react/shared/text";
import FileInput from "./file-input";
import UploadTextarea from "./upload-textarea";

import { DataSource, DataType } from "../types";

interface Props {
	source: DataSource;
	dataType: DataType;
	fileName: string | null;
	rawData: string;
	errorText: string | null;
	onRawDataChange: (rawData: string, fileName?: string) => void;
}

export default function UploadData({
	source,
	fileName,
	dataType,
	rawData,
	errorText,
	onRawDataChange,
}: Props) {
	return (
		<div className="dataloom-upload-data">
			{source === DataSource.COPY_PASTE && (
				<UploadTextarea value={rawData} onChange={onRawDataChange} />
			)}
			{source === DataSource.FILE && (
				<FileInput
					fileName={fileName}
					dataType={dataType}
					onChange={onRawDataChange}
				/>
			)}
			{errorText !== null && (
				<Text variant="error" value={errorText} size="sm" />
			)}
		</div>
	);
}
