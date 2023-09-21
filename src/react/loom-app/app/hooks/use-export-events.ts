import React from "react";
import { isEventForThisApp } from "src/shared/event-system/utils";
import { EVENT_DOWNLOAD_CSV, EVENT_DOWNLOAD_MARKDOWN } from "src/shared/events";
import {
	getExportFileName,
	getBlobTypeForExportType,
	downloadFile,
} from "src/shared/export/download-utils";
import { exportToCSV } from "src/shared/export/export-to-csv";
import { exportToMarkdown } from "src/shared/export/export-to-markdown";
import { ExportType } from "src/shared/export/types";
import { LoomState } from "src/shared/loom-state/types/loom-state";
import { useAppMount } from "../../app-mount-provider";
import { useAppSelector } from "src/redux/hooks";

export const useExportEvents = (state: LoomState) => {
	const { reactAppId, loomFile, app } = useAppMount();
	const { removeMarkdownOnExport } = useAppSelector(
		(state) => state.global.settings
	);
	const filePath = loomFile.path;

	React.useEffect(() => {
		function handleDownloadCSV() {
			if (isEventForThisApp(reactAppId)) {
				//Set timeout to wait for the command window to disappear
				setTimeout(() => {
					const data = exportToCSV(
						app,
						state,
						removeMarkdownOnExport
					);
					const exportFileName = getExportFileName(filePath);
					const blobType = getBlobTypeForExportType(ExportType.CSV);
					downloadFile(exportFileName, blobType, data);
				}, 100);
			}
		}

		function handleDownloadMarkdown() {
			if (isEventForThisApp(reactAppId)) {
				//Set timeout to wait for the command window to disappear
				setTimeout(() => {
					const data = exportToMarkdown(
						app,
						state,
						removeMarkdownOnExport
					);
					const exportFileName = getExportFileName(filePath);
					const blobType = getBlobTypeForExportType(
						ExportType.MARKDOWN
					);
					downloadFile(exportFileName, blobType, data);
				}, 100);
			}
		}

		//@ts-expect-error missing overload
		app.workspace.on(EVENT_DOWNLOAD_CSV, handleDownloadCSV);
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_DOWNLOAD_MARKDOWN, handleDownloadMarkdown);

		return () => {
			app.workspace.off(EVENT_DOWNLOAD_CSV, handleDownloadCSV);
			app.workspace.off(EVENT_DOWNLOAD_MARKDOWN, handleDownloadMarkdown);
		};
	}, [filePath, state, reactAppId, removeMarkdownOnExport, app]);
};
