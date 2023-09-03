import React from "react";

import Papa from "papaparse";

import DataTypeSelect from "./data-type-select";
import Stepper from "../shared/stepper";
import DataSourceSelect from "./data-source-select";
import UploadData from "./upload-data";

import { LoomState } from "src/shared/loom-state/types";
import { Step } from "../shared/stepper/types";
import { DataSource, DataType, StepType } from "./types";

import MatchColumns from "./match-columns";

import {
	parseMarkdownTableIntoTokens,
	tableTokensToArr,
	validateMarkdownTable,
} from "./table-utils";

import "./styles.css";

interface Props {
	initialState: LoomState;
	onStateSave: (state: LoomState) => void;
}

export default function ImportApp({ initialState, onStateSave }: Props) {
	//Step 1
	const [dataSource, setDataSource] = React.useState(DataSource.UNSELECTED);

	//Step 2
	const [dataType, setDataType] = React.useState(DataType.UNSELECTED);

	//Step 3
	const [fileName, setFileName] = React.useState<string | null>(null);
	const [rawData, setRawData] = React.useState("");
	const [data, setData] = React.useState<string[][]>([]);
	const [errorText, setErrorText] = React.useState<string | null>(null);

	//Step 4
	const [columnsToImport, setColumnsToImport] = React.useState<number[]>([]);

	function handleColumnToggle(index: number) {
		setColumnsToImport((prevState) => {
			if (prevState.includes(index)) {
				return prevState.filter((i) => i !== index);
			} else {
				return [...prevState, index];
			}
		});
	}

	function handleDataTypeChange(value: DataType) {
		setDataType(value);
		resetSubsequentSteps(StepType.DATA_TYPE);
	}

	function handleDataSourceChange(value: DataSource) {
		setDataSource(value);
		resetSubsequentSteps(StepType.DATA_SOURCE);
	}

	function handleRawDataChange(rawData: string, fileName?: string) {
		setRawData(rawData);
		if (fileName !== undefined) {
			setFileName(fileName);
		}
	}

	function handleSelectAllColumns() {
		setColumnsToImport(data.map((_, i) => i));
	}

	function handleDeselectAllColumns() {
		setColumnsToImport([]);
	}

	/**
	 * Resets the previous steps to their initial state.
	 * @param currentIndex
	 */
	function resetSubsequentSteps(currentType: StepType) {
		if (currentType !== StepType.DATA_SOURCE) {
			setDataSource(DataSource.UNSELECTED);
		}
		if (currentType !== StepType.UPLOAD_DATA) {
			setRawData("");
			setErrorText(null);
			setFileName(null);
			setData([]);
		}
		if (currentType !== StepType.MATCH_COLUMNS) {
			setColumnsToImport([]);
		}
	}

	const steps: Step[] = [
		{
			title: "Select data type",
			content: (
				<DataTypeSelect
					value={dataType}
					onChange={handleDataTypeChange}
				/>
			),
			canContinue: dataType !== DataType.UNSELECTED,
		},
		{
			title: "Select data source",
			content: (
				<DataSourceSelect
					value={dataSource}
					onChange={handleDataSourceChange}
				/>
			),
			canContinue: dataSource !== DataSource.UNSELECTED,
		},
		{
			title: "Upload data",
			content: (
				<UploadData
					source={dataSource}
					fileName={fileName}
					dataType={dataType}
					errorText={errorText}
					rawData={rawData}
					onRawDataChange={handleRawDataChange}
				/>
			),
			canContinue: rawData !== "",
			onContinue: () => {
				if (dataType === DataType.CSV) {
					const { data, errors } = Papa.parse(rawData);
					if (errors.length > 0) {
						setErrorText(errors[0].message);
						return false;
					}
					setData(data as string[][]);
					setColumnsToImport(data.map((_, i) => i));
				} else if (dataType === DataType.MARKDOWN) {
					try {
						const tokens = parseMarkdownTableIntoTokens(rawData);
						validateMarkdownTable(tokens);
						const data = tableTokensToArr(tokens);
						setData(data);
						setColumnsToImport(data.map((_, i) => i));
					} catch (err: unknown) {
						setErrorText((err as Error).message);
						return false;
					}
				}
				return true;
			},
		},
		{
			title: "Match columns",
			content: (
				<MatchColumns
					data={data}
					columnsToImport={columnsToImport}
					onColumnToggle={handleColumnToggle}
					onSelectAllColumns={handleSelectAllColumns}
					onDeselectAllColumns={handleDeselectAllColumns}
				/>
			),
		},
	];

	function handleFinishClick() {}

	// <button className="mod-cta" onClick={handleImportClick}>
	// 	Import
	// </button>;

	return (
		<div className="dataloom-import-app">
			<Stepper
				steps={steps}
				finishButtonLabel="Finish"
				onFinishClick={handleFinishClick}
			/>
		</div>
	);
}
