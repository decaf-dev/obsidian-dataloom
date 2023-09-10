import React from "react";

import Stack from "../shared/stack";
import ExportTypeSelect from "./export-type-select";
import ContentTextArea from "./content-textarea";

import { LoomState } from "src/shared/loom-state/types";
import { ExportType } from "../../shared/export/types";
import { exportToMarkdown } from "src/shared/export/export-to-markdown";
import { App, Notice } from "obsidian";
import {
	downloadFile,
	getBlobTypeForExportType,
	getExportFileName,
} from "../../shared/export/download-utils";
import { exportToCSV } from "src/shared/export/export-to-csv";
import { useAppSelector } from "src/redux/hooks";

import "./styles.css";
import Switch from "../shared/switch";

interface Props {
	app: App;
	loomState: LoomState;
	loomFilePath: string;
}

export function ExportApp({ app, loomState, loomFilePath }: Props) {
	const [exportType, setExportType] = React.useState<ExportType>(
		ExportType.UNSELECTED
	);
	const { removeMarkdownOnExport } = useAppSelector(
		(state) => state.global.settings
	);
	const [shouldRemoveMarkdown, setRemoveMarkdown] = React.useState<boolean>(
		removeMarkdownOnExport
	);

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
