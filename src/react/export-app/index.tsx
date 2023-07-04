import { DashboardState } from "src/shared/types";
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
import { useAppSelector } from "src/redux/global/hooks";

interface Props {
	dashboardState: DashboardState;
	filePath: string;
}

export function ExportApp({ dashboardState, filePath }: Props) {
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
		const fileName = getExportFileName(filePath);
		const blobType = getBlobTypeForExportType(exportType);
		downloadFile(fileName, blobType, content);
	}

	let content = "";
	if (exportType === ExportType.MARKDOWN) {
		content = exportToMarkdown(dashboardState, renderMarkdown);
	} else if (exportType === ExportType.CSV) {
		content = exportToCSV(dashboardState, renderMarkdown);
	}

	return (
		<div className="Dashboards__export-app">
			<Padding p="xl">
				<h5
					css={css`
						margin-top: 0px;
						margin-bottom: 0px;
					`}
				>
					Dashboards Export
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
							<Stack isVertical spacing="sm">
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

							<Stack>
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
