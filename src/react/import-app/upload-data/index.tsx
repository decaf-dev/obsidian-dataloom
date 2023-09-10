import Text from "src/react/shared/text";
import FileInput from "./file-input";
import UploadTextarea from "./upload-textarea";

import { DataSource, DataType } from "../types";

interface Props {
	source: DataSource;
	dataType: DataType;
	fileName: string | null;
	hasHeadersRow: boolean;
	rawData: string;
	errorText: string | null;
	onRawDataChange: (rawData: string, fileName?: string) => void;
	onHeadersRowToggle: () => void;
}

export default function UploadData({
	source,
	fileName,
	dataType,
	hasHeadersRow,
	rawData,
	errorText,
	onRawDataChange,
	onHeadersRowToggle,
}: Props) {
	return (
		<div className="dataloom-upload-data">
			{source === DataSource.PASTE && (
				<UploadTextarea value={rawData} onChange={onRawDataChange} />
			)}
			{source === DataSource.FILE && (
				<FileInput
					fileName={fileName}
					dataType={dataType}
					hasHeadersRow={hasHeadersRow}
					onHeadersRowToggle={onHeadersRowToggle}
					onDataChange={onRawDataChange}
				/>
			)}
			{errorText !== null && (
				<Text variant="error" value={errorText} size="sm" />
			)}
		</div>
	);
}
