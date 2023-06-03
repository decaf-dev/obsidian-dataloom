import { TableState } from "src/shared/types/types";
import Stack from "../shared/stack";
import React from "react";
import { ExportType } from "../../shared/export/types";
import ExportTypeSelect from "./export-type-select";
import ContentTextArea from "./content-textarea";
import { exportToMarkdown } from "src/shared/export/export-to-markdown";
import { Notice } from "obsidian";
import Padding from "../shared/padding";
import {
	downloadFile,
	getBlobTypeForExportType,
	getExportFileName,
} from "../../shared/export/download-utils";
import { exportToCSV } from "src/shared/export/export-to-csv";
import { css } from "@emotion/react";

interface Props {
	tableState: TableState;
	filePath: string;
}

export function ExportApp({ tableState, filePath }: Props) {
	const [exportType, setExportType] = React.useState<ExportType>(
		ExportType.UNSELECTED
	);

	async function handleCopyClick(value: string) {
		await navigator.clipboard.writeText(value);
		new Notice("Copied to clipboard");
	}

	function handleDownloadClick() {
		const fileName = getExportFileName(filePath);
		const blobType = getBlobTypeForExportType(exportType);
		downloadFile(fileName, blobType, content);
	}

	let content = "";
	if (exportType === ExportType.MARKDOWN) {
		content = exportToMarkdown(tableState);
	} else if (exportType === ExportType.CSV) {
		content = exportToCSV(tableState);
	}

	return (
		<div className="NLT__export-app">
			<Padding pb="xl">
				<h5
					css={css`
						margin-top: 0px;
						margin-bottom: 0px;
					`}
				>
					Notion-Like Tables Export
				</h5>
				<hr
					css={css`
						margin: 1rem 0;
					`}
				/>
				<Stack spacing="xl" isVertical>
					<ExportTypeSelect
						value={exportType}
						onChange={setExportType}
					/>
					{exportType !== ExportType.UNSELECTED && (
						<>
							<ContentTextArea value={content} />
							<Stack>
								<button
									className="mod-cta"
									onClick={handleDownloadClick}
								>
									Download
								</button>
								<button
									onClick={() => handleCopyClick(content)}
								>
									Copy to clipboard
								</button>
							</Stack>
						</>
					)}
				</Stack>
			</Padding>
		</div>
	);
}
