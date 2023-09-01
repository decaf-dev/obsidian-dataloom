import React from "react";

import Papa from "papaparse";

import DataTypeSelect from "./steps/data-type-select";
import Stepper from "../shared/stepper";
import DataSourceSelect from "./steps/data-source-select";
import UploadData from "./steps/upload-data";

import { LoomState } from "src/shared/loom-state/types";
import { Step } from "../shared/stepper/types";
import { DataSource, DataType } from "./types";

import AssignData from "./steps/assign-data";

import {
	parseMarkdownTableIntoTokens,
	tableTokensToArr,
	validateMarkdownTable,
} from "./markdown-table";

import "./styles.css";

interface Props {
	initialState: LoomState;
	onStateSave: (state: LoomState) => void;
}

export default function ImportApp({ initialState, onStateSave }: Props) {
	const [dataSource, setDataSource] = React.useState(DataSource.UNSELECTED);
	const [dataType, setDataType] = React.useState(DataType.UNSELECTED);
	const [rawData, setRawData] = React.useState("");
	const [data, setData] = React.useState<string[][]>([]);
	const [errorText, setErrorText] = React.useState<string | null>(null);

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
		{
			title: "Upload data",
			content: (
				<UploadData
					source={dataSource}
					dataType={dataType}
					errorText={errorText}
					rawData={rawData}
					onRawDataChange={setRawData}
				/>
			),
			canContinue: rawData !== "",
			onBack: () => {
				setRawData("");
				setErrorText(null);
			},
			onContinue: () => {
				if (dataType === DataType.CSV) {
					const { data, errors } = Papa.parse(rawData);
					if (errors.length > 0) {
						setErrorText(errors[0].message);
						return false;
					}
					setData(data as string[][]);
				} else if (dataType === DataType.MARKDOWN) {
					try {
						const tokens = parseMarkdownTableIntoTokens(rawData);
						validateMarkdownTable(tokens);
						const data = tableTokensToArr(tokens);
						setData(data);
					} catch (err: unknown) {
						setErrorText((err as Error).message);
						return false;
					}
				}
				return true;
			},
		},
		{
			title: "Assign data to table columns",
			content: <AssignData data={data} />,
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
