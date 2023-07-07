import { DashboardState } from "src/shared/types";
import {
	getMarkdownListItems,
	importMarkdownListItems,
	validateMarkdownList,
} from "./utils";
import { ImportType } from "./types";
import { useState } from "react";

import ImportTypeSelect from "./import-type-select";
import ColumnSelect from "./column-select";
import { ERROR_TEXT_DEFAULT } from "./constants";
import MarkdownInput from "./markdown-input";
import Stack from "../shared/stack";

import "./styles.css";

interface Props {
	initialState: DashboardState;
	onStateSave: (state: DashboardState) => void;
}

export default function ImportApp({ initialState, onStateSave }: Props) {
	const [inputText, setInputText] = useState("");
	const [importType, setImportType] = useState(-1);
	const [columnId, setColumnId] = useState("");
	const [errorText, setErrorText] = useState(ERROR_TEXT_DEFAULT);

	function handleImportClick() {
		if (importType === ImportType.MARKDOWN_LIST) {
			if (validateMarkdownList(inputText)) {
				const listItems = getMarkdownListItems(inputText);
				const updatedState = importMarkdownListItems(
					listItems,
					columnId,
					initialState
				);
				onStateSave(updatedState);
				return;
			}
			setErrorText("Invalid markdown");
		}
	}

	let errorTextClassName = "error-text";
	if (errorText !== ERROR_TEXT_DEFAULT)
		errorTextClassName += " error-text--visible";

	const { columns, headerCells } = initialState.model;

	return (
		<div className="Dashboards__import-app">
			<Stack spacing="lg">
				<Stack spacing="lg">
					<ImportTypeSelect
						value={importType}
						onChange={setImportType}
					/>
					{importType !== -1 && (
						<ColumnSelect
							columns={columns}
							headerCells={headerCells}
							value={columnId}
							onChange={setColumnId}
						/>
					)}
				</Stack>
				{importType !== -1 && columnId !== "" && (
					<>
						<MarkdownInput
							value={inputText}
							onChange={setInputText}
						/>
						<div className={errorTextClassName}>{errorText}</div>
						<button className="mod-cta" onClick={handleImportClick}>
							Import
						</button>
					</>
				)}
			</Stack>
		</div>
	);
}
