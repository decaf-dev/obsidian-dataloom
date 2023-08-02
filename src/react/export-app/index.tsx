import { LoomState } from "src/shared/loom-state/types";
import Stack from "../shared/stack";
import React from "react";
import { ExportType } from "../../shared/export/types";
import ExportTypeSelect from "./export-type-select";
import ContentTextArea from "./content-textarea";
import { exportToMarkdown } from "src/shared/export/export-to-markdown";
import { App, Notice } from "obsidian";
import Padding from "../shared/padding";
import {
	downloadFile,
	getBlobTypeForExportType,
	getExportFileName,
} from "../../shared/export/download-utils";
import { exportToCSV } from "src/shared/export/export-to-csv";
import { css } from "@emotion/react";
import { useAppSelector } from "src/redux/hooks";

interface Props {
	app: App;
	loomState: LoomState;
	loomFilePath: string;
}

export function ExportApp({ loomState, loomFilePath }: Props) {
	const [exportType, setExportType] = React.useState<ExportType>(
		ExportType.UNSELECTED
	);
	const { exportRenderMarkdown } = useAppSelector(
		(state) => state.global.settings
	);
	const [renderMarkdown, setRenderMarkdown] =
		React.useState<boolean>(exportRenderMarkdown);

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
		content = exportToMarkdown(app, loomState, renderMarkdown);
	} else if (exportType === ExportType.CSV) {
		content = exportToCSV(app, loomState, renderMarkdown);
	}

	return (
		<div className="dataloom-export-app">
			<Padding p="xl">
				<h5
					css={css`
						margin-top: 0px;
						margin-bottom: 0px;
					`}
				>
					DataLoom Export
				</h5>
				<hr
					css={css`
						margin: 1rem 0;
					`}
				/>
				<Stack spacing="xl">
					<ExportTypeSelect
						value={exportType}
						onChange={setExportType}
					/>
					{exportType !== ExportType.UNSELECTED && (
						<>
							<ContentTextArea value={content} />
							<Stack spacing="sm">
								<label htmlFor="render-markdown">
									Render markdown
								</label>
								<input
									id="render-markdown"
									type="checkbox"
									checked={renderMarkdown}
									onChange={() =>
										setRenderMarkdown(!renderMarkdown)
									}
								/>
							</Stack>

							<Stack isHorizontal>
								<button
									className="mod-cta"
									onClick={handleDownloadClick}
								>
									Download
								</button>
								<button
									css={css`
										background-color: var(
											--background-secondary-alt
										) !important;
									`}
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
