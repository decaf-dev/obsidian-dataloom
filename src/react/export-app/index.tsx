import React from "react";

import Stack from "../shared/stack";
import ContentTextArea from "./content-textarea";
import ExportTypeSelect from "./export-type-select";

import { App, Notice } from "obsidian";
import { exportToCSV } from "src/shared/export/export-to-csv";
import { exportToMarkdown } from "src/shared/export/export-to-markdown";
import { type LoomState } from "src/shared/loom-state/types/loom-state";
import {
	downloadFile,
	getBlobTypeForExportType,
	getExportFileName,
} from "../../shared/export/download-utils";
import { ExportType } from "../../shared/export/types";

import Switch from "../shared/switch";
import "./styles.css";

interface Props {
	app: App;
	loomState: LoomState;
	loomFilePath: string;
}

export function ExportApp({ app, loomState, loomFilePath }: Props) {
	const [exportType, setExportType] = React.useState<ExportType>(
		ExportType.UNSELECTED
	);
	const [shouldRemoveMarkdown, setRemoveMarkdown] =
		React.useState<boolean>(true);

	async function handleCopyClick(value: string) {
		await navigator.clipboard.writeText(value);
		new Notice("Copied to clipboard");
	}

	function handleDownloadClick() {
		const fileName = getExportFileName(loomFilePath);
		const blobType = getBlobTypeForExportType(exportType);
		downloadFile(fileName, blobType, content);
	}

	let content = "";
	if (exportType === ExportType.MARKDOWN) {
		content = exportToMarkdown(app, loomState, shouldRemoveMarkdown);
	} else if (exportType === ExportType.CSV) {
		content = exportToCSV(app, loomState, shouldRemoveMarkdown);
	}

	return (
		<div className="dataloom-export-app">
			<Stack spacing="xl" width="100%">
				<ExportTypeSelect value={exportType} onChange={setExportType} />
				{exportType !== ExportType.UNSELECTED && (
					<>
						<Stack spacing="sm">
							<label htmlFor="remove-markdown">
								Remove markdown
							</label>
							<Switch
								id="remove-markdown"
								value={shouldRemoveMarkdown}
								onToggle={() =>
									setRemoveMarkdown((prevState) => !prevState)
								}
							/>
						</Stack>
						<ContentTextArea value={content} />
						<Stack isHorizontal>
							<button
								className="mod-cta"
								onClick={handleDownloadClick}
							>
								Download
							</button>
							<button
								className="dataloom-copy-button"
								onClick={() => handleCopyClick(content)}
							>
								Copy to clipboard
							</button>
						</Stack>
					</>
				)}
			</Stack>
		</div>
	);
}
