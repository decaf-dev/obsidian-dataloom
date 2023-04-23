import { TableState } from "src/services/tableState/types";
import {
	getMarkdownListItems,
	importMarkdownListItems,
	validateMarkdownList,
} from "./services/utils";
import { ImportType } from "./types";
import { useState } from "react";

import "./styles.css";
import ImportTypeSelect from "./components/ImportTypeSelect";
import ColumnSelect from "./components/ColumnSelect";
import Stack from "src/components/Stack";
import { ERROR_TEXT_DEFAULT } from "./constants";
import MarkdownInput from "./components/MarkdownInput";
import { addRow } from "src/services/tableState/row";
import { CellNotFoundError } from "src/services/tableState/error";

interface Props {
	initialState: TableState;
	onStateSave: (state: TableState) => void;
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
		<div className="NLT__import-app">
			<Stack spacing="lg" isVertical>
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
