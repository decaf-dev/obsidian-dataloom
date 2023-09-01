import Text from "src/react/shared/text";
import FileInput from "../file-input";
import { DataSource, DataType } from "../types";
import PasteFromClipboard from "../paste-from-clipboard";

interface Props {
	source: DataSource;
	dataType: DataType;
	rawData: string;
	errorText: string | null;
	onRawDataChange: (data: string) => void;
}

export default function UploadData({
	source,
	dataType,
	rawData,
	errorText,
	onRawDataChange,
}: Props) {
	return (
		<div>
			{source === DataSource.COPY_PASTE && (
				<PasteFromClipboard
					value={rawData}
					onChange={onRawDataChange}
				/>
			)}
			{source === DataSource.FILE && (
				<FileInput dataType={dataType} onChange={onRawDataChange} />
			)}
			{errorText !== null && (
				<Text variant="error" value={errorText} size="sm" />
			)}
		</div>
	);
}
