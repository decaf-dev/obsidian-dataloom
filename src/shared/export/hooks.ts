import React from "react";
import { TableState } from "../types/types";
import { useViewContext } from "../view-context";
import {
	downloadFile,
	getBlobTypeForExportType,
	getExportFileName,
} from "src/shared/export/download-utils";
import { ExportType } from "src/shared/export/types";
import { exportToCSV } from "./export-to-csv";
import { exportToMarkdown } from "./export-to-markdown";
import { EVENT_DOWNLOAD_CSV, EVENT_DOWNLOAD_MARKDOWN } from "../events";

export const useExportEvents = (state: TableState) => {
	const view = useViewContext();

	React.useEffect(() => {
		function handleDownloadCSV() {
			//Set timeout to wait for the command window to disappear
			setTimeout(() => {
				const data = exportToCSV(state);
				const fileName = getExportFileName(view.getDisplayText());
				const blobType = getBlobTypeForExportType(ExportType.MARKDOWN);
				downloadFile(fileName, blobType, data);
			}, 100);
		}

		function handleDownloadMarkdown() {
			//Set timeout to wait for the command window to disappear
			setTimeout(() => {
				const data = exportToMarkdown(state);
				const fileName = getExportFileName(view.getDisplayText());
				const blobType = getBlobTypeForExportType(ExportType.MARKDOWN);
				downloadFile(fileName, blobType, data);
			}, 100);
		}

		//@ts-expect-error missing overload
		app.workspace.on(EVENT_DOWNLOAD_CSV, handleDownloadCSV);
		//@ts-expect-error missing overload
		app.workspace.on(EVENT_DOWNLOAD_MARKDOWN, handleDownloadMarkdown);

		return () => {
			app.workspace.off(EVENT_DOWNLOAD_CSV, handleDownloadCSV);
			app.workspace.off(EVENT_DOWNLOAD_MARKDOWN, handleDownloadMarkdown);
		};
	}, [view, state]);
};
