import React from "react";

import Papa from "papaparse";

import DataTypeSelect from "./data-type-select";
import Stepper from "../shared/stepper";
import DataSourceSelect from "./data-source-select";
import UploadData from "./upload-data";

import { LoomState } from "src/shared/loom-state/types/loom-state";
import { Step } from "../shared/stepper/types";
import {
	ImportColumn,
	DataSource,
	DataType,
	StepType,
	ColumnMatch,
	ImportData,
} from "./types";

import MatchColumns from "./match-columns";

import {
	parseMarkdownTableIntoTokens,
	tableTokensToArr,
	validateMarkdownTable,
} from "./table-utils";

import "./styles.css";
import { addImportData } from "./state-utils";
import { useMenuOperations } from "../shared/menu-provider/hooks";

interface Props {
	state: LoomState;
	onStateChange: (value: LoomState) => void;
}

export default function ImportApp({ state, onStateChange }: Props) {
	const menuOperations = useMenuOperations();

	//Step 1
	const [dataSource, setDataSource] = React.useState(DataSource.UNSELECTED);

	//Step 2
	const [dataType, setDataType] = React.useState(DataType.UNSELECTED);

	//Step 3
	const [fileName, setFileName] = React.useState<string | null>(null);
	const [rawData, setRawData] = React.useState("");
	const [data, setData] = React.useState<ImportData>([]);
	const [errorText, setErrorText] = React.useState<string | null>(null);
	const [hasHeadersRow, setHeadersRow] = React.useState(true);

	//Step 4
	const [enabledColumnIndices, setEnabledColumnIndices] = React.useState<
		number[]
	>([]);

	const [columnMatches, setColumnMatches] = React.useState<ColumnMatch[]>([]);

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
		if (fileName !== undefined) setFileName(fileName);
	}

	function handleHeadersRowToggle() {
		setHeadersRow((prevState) => !prevState);
	}

	function handleAllColumnsEnabledToggle(value: boolean) {
		if (value) {
			setEnabledColumnIndices(data[0].map((_, i) => i));
		} else {
			setEnabledColumnIndices([]);
		}
	}

	function handleColumnMatch(index: number, columnId: string | null) {
		setColumnMatches((prevState) => {
			const filtered = prevState.filter(
				(match) => match.importColumnIndex !== index
			);
			if (columnId === null) return filtered;
			const match = { importColumnIndex: index, columnId };
			return [...filtered, match];
		});
	}

	function handleAllColumnsMatch(columnId: string | null) {
		setColumnMatches(() => {
			if (columnId === null) return [];
			return data[0].map((_, i) => ({
				importColumnIndex: i,
				columnId,
			}));
		});
	}

	function handleColumnEnabledToggle(index: number) {
		setEnabledColumnIndices((prevState) => {
			if (prevState.includes(index)) {
				return prevState.filter((i) => i !== index);
			}
			return [...prevState, index];
		});
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
			setEnabledColumnIndices([]);
			setColumnMatches([]);
		}
	}

	const columns: ImportColumn[] = [
		...state.model.columns.map((column) => {
			const { id, type, content } = column;
			return {
				id,
				name: content,
				type,
			};
		}),
	];

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
					hasHeadersRow={hasHeadersRow}
					source={dataSource}
					fileName={fileName}
					dataType={dataType}
					errorText={errorText}
					rawData={rawData}
					onRawDataChange={handleRawDataChange}
					onHeadersRowToggle={handleHeadersRowToggle}
				/>
			),
			canContinue: rawData !== "",
			onContinue: () => {
				let parsedArr: string[][] = [];

				if (dataType === DataType.CSV) {
					//Trim trailing whitespace
					//There is a bug in Papa.parse where it will parse an empty string as a single empty row
					const rawDataTrimmed = rawData.trim();
					const { data, errors } = Papa.parse(rawDataTrimmed, {
						skipEmptyLines: true,
					});
					parsedArr = data as string[][];
					if (errors.length > 0) {
						setErrorText(errors[0].message);
						return false;
					}
				} else if (dataType === DataType.MARKDOWN) {
					try {
						const tokens = parseMarkdownTableIntoTokens(rawData);
						validateMarkdownTable(tokens);
						parsedArr = tableTokensToArr(tokens);
					} catch (err: unknown) {
						setErrorText((err as Error).message);
						return false;
					}
				}
				if (!hasHeadersRow) {
					parsedArr.unshift(
						parsedArr[0].map((_, i) => `Unnamed ${i}`)
					);
				}

				setData(parsedArr);
				setEnabledColumnIndices(parsedArr[0].map((_, i) => i));
				return true;
			},
		},
		{
			title: "Match columns",
			content: (
				<MatchColumns
					data={data}
					columnMatches={columnMatches}
					columns={columns}
					enabledColumnIndices={enabledColumnIndices}
					onColumnEnabledToggle={handleColumnEnabledToggle}
					onAllColumnsEnabledToggle={handleAllColumnsEnabledToggle}
					onAllColumnsMatch={handleAllColumnsMatch}
					onColumnMatch={handleColumnMatch}
				/>
			),
			canContinue: () => {
				if (enabledColumnIndices.length === 0) return false;
				const everyColumnMatched = enabledColumnIndices.every(
					(index) =>
						columnMatches.find(
							(match) => match.importColumnIndex === index
						) ?? false
				);
				return everyColumnMatched;
			},
		},
	];

	function handleModalClick(e: React.MouseEvent) {
		e.stopPropagation();
		menuOperations.onCloseAll();
	}

	function handleFinishClick() {
		const newState = addImportData(state, data, columnMatches);
		onStateChange(newState);
	}

	return (
		<div className="dataloom-import-app" onClick={handleModalClick}>
			<Stepper steps={steps} onFinishClick={handleFinishClick} />
		</div>
	);
}
