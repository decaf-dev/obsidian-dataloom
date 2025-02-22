import React from "react";
import { useAppSelector } from "src/redux/hooks";
import EventManager from "src/shared/event/event-manager";
import { isEventForThisApp } from "src/shared/event/utils";
import {
	downloadFile,
	getBlobTypeForExportType,
	getExportFileName,
} from "src/shared/export/download-utils";
import { exportToCSV } from "src/shared/export/export-to-csv";
import { exportToMarkdown } from "src/shared/export/export-to-markdown";
import { ExportType } from "src/shared/export/types";
import type { LoomState } from "src/shared/loom-state/types/loom-state";
import { useAppMount } from "../../app-mount-provider";

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

		EventManager.getInstance().on("download-csv", handleDownloadCSV);
		EventManager.getInstance().on(
			"download-markdown",
			handleDownloadMarkdown
		);

		return () => {
			EventManager.getInstance().off("download-csv", handleDownloadCSV);
			EventManager.getInstance().off(
				"download-markdown",
				handleDownloadMarkdown
			);
		};
	}, [filePath, state, reactAppId, removeMarkdownOnExport, app]);
};
