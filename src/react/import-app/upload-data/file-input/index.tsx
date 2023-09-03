import React from "react";
import Stack from "../../../shared/stack";
import Text from "../../../shared/text";

import { DataType } from "../../types";
import { getAcceptForDataType } from "../../utils";

import "./styles.css";

interface Props {
	fileName: string | null;
	dataType: DataType;
	onChange: (rawData: string, fileName: string) => void;
}

export default function FileInput({ fileName, dataType, onChange }: Props) {
	function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0] ?? null;
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			onChange((e.target?.result as string) ?? "", file.name);
		};

		reader.readAsText(file);
	}
	const accept = getAcceptForDataType(dataType);
	return (
		<div className="dataloom-file-input">
			<Stack>
				<Text
					value={fileName ?? "No file chosen"}
					maxWidth="25em"
					noWrap
				/>
				<input type="file" accept={accept} onChange={handleUpload} />
			</Stack>
		</div>
	);
}
