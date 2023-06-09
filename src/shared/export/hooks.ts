import React from "react";
import { TableState } from "../types/types";
import { useMountState } from "../view-context";
import {
	downloadFile,
	getBlobTypeForExportType,
	getExportFileName,
} from "src/shared/export/download-utils";
import { ExportType } from "src/shared/export/types";
import { exportToCSV } from "./export-to-csv";
import { exportToMarkdown } from "./export-to-markdown";
import { EVENT_DOWNLOAD_CSV, EVENT_DOWNLOAD_MARKDOWN } from "../events";
import { isEventForThisApp } from "../event-system/utils";

export const useExportEvents = (state: TableState) => {
	const { filePath } = useMountState();
	const { appId } = useMountState();

	React.useEffect(() => {
		function handleDownloadCSV() {
			if (isEventForThisApp(appId)) {
				//Set timeout to wait for the command window to disappear
				setTimeout(() => {
					const data = exportToCSV(state);
					const exportFileName = getExportFileName(filePath);
					const blobType = getBlobTypeForExportType(
						ExportType.MARKDOWN
					);
					downloadFile(exportFileName, blobType, data);
				}, 100);
			}
		}

		function handleDownloadMarkdown() {
			if (isEventForThisApp(appId)) {
				//Set timeout to wait for the command window to disappear
				setTimeout(() => {
					const data = exportToMarkdown(state);
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
	}, [filePath, state, appId]);
};
