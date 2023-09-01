import Papa from "papaparse";
import { DataType } from "./types";
import { getAcceptForDataType } from "./utils";

interface Props {
	dataType: DataType;
	onChange: (value: string) => void;
}

export default function FileInput({ dataType, onChange }: Props) {
	function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] ?? null;
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			onChange(e.target?.result as string);
		};

		reader.readAsText(file);
	}
	const accept = getAcceptForDataType(dataType);
	return <input type="file" accept={accept} onChange={handleUpload} />;
}
