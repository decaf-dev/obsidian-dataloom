import React from "react";

import DataTypeSelect from "./import-type-select";
import Stepper from "../shared/stepper";

import { LoomState } from "src/shared/loom-state/types";
import { Step } from "../shared/stepper/types";
import { ERROR_TEXT_DEFAULT } from "./constants";
import { DataSource, DataType } from "./types";

import "./styles.css";
import DataSourceSelect from "./data-source-select";

interface Props {
	initialState: LoomState;
	onStateSave: (state: LoomState) => void;
}

export default function ImportApp({ initialState, onStateSave }: Props) {
	const [inputText, setInputText] = React.useState("");
	const [dataSource, setDataSource] = React.useState(DataSource.UNSELECTED);
	const [dataType, setDataType] = React.useState(DataType.UNSELECTED);
	const [columnId, setColumnId] = React.useState("");
	const [errorText, setErrorText] = React.useState(ERROR_TEXT_DEFAULT);

	const steps: Step[] = [
		{
			title: "Select data type",
			content: <DataTypeSelect value={dataType} onChange={setDataType} />,
			canContinue: dataType !== DataType.UNSELECTED,
		},
		{
			title: "Select data source",
			content: (
				<DataSourceSelect value={dataSource} onChange={setDataSource} />
			),
			canContinue: dataSource !== DataSource.UNSELECTED,
		},
		{ title: "Step 3", content: <div>Step 2 content here</div> },
	];

	function handleFinishClick() {
		// if (dataType === DataType.MARKDOWN_LIST) {
		// 	if (validateMarkdownList(inputText)) {
		// 		const listItems = getMarkdownListItems(inputText);
		// 		const updatedState = importMarkdownListItems(
		// 			listItems,
		// 			columnId,
		// 			initialState
		// 		);
		// 		onStateSave(updatedState);
		// 		return;
		// 	}
		// 	setErrorText("Invalid markdown");
		// }
	}

	let errorTextClassName = "error-text";
	if (errorText !== ERROR_TEXT_DEFAULT)
		errorTextClassName += " error-text--visible";

	// const { columns, headerCells } = initialState.model;

	return (
		<div className="dataloom-import-app">
			<Stepper
				steps={steps}
				finishButtonLabel="Finish Import"
				onFinishClick={handleFinishClick}
			/>
			{/* <Stack spacing="xl">
				<Stack spacing="lg">
					<DataTypeSelect
						value={dataType}
						onChange={setDataType}
					/>
					{dataType !== -1 && (
						<ColumnSelect
							columns={columns}
							headerCells={headerCells}
							value={columnId}
							onChange={setColumnId}
						/>
					)}
				</Stack>
				{dataType !== -1 && columnId !== "" && (
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
			</Stack> */}
		</div>
	);
}
