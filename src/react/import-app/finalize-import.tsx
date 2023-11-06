import {
	DateFormat,
	DateFormatSeparator,
} from "src/shared/loom-state/types/loom-state";
import Select from "../shared/select";
import { getDisplayNameForDateFormat } from "src/shared/loom-state/type-display-names";
import React from "react";
import Stack from "../shared/stack";
import Text from "../shared/text";
import Padding from "../shared/padding";

interface Props {
	hasDateColumnMatch: boolean;
	dateFormat: DateFormat | null;
	dateFormatSeparator: DateFormatSeparator | null;
	onDateFormatChange: (value: DateFormat | null) => void;
	onDateFormatSeparatorChange: (value: DateFormatSeparator | null) => void;
}

export default function FinalizeImport({
	hasDateColumnMatch,
	dateFormat,
	dateFormatSeparator,
	onDateFormatChange,
	onDateFormatSeparatorChange,
}: Props) {
	const dateFormatId = React.useId();
	const dateFormatSeparatorId = React.useId();
	const importColumnDateFormat = React.useId();

	if (!hasDateColumnMatch) return <Text value="Everything looks good!" />;

	let exampleDateFormat = "Unknown";
	if (dateFormat && dateFormatSeparator) {
		exampleDateFormat = getExampleDateFormat(
			dateFormat,
			dateFormatSeparator
		);
	}
	return (
		<div>
			{hasDateColumnMatch && (
				<>
					<Stack spacing="xl">
						<Stack spacing="sm">
							<Text
								size="md"
								variant="semibold"
								value="Date format"
							/>
							<Padding pr="md">
								<Text
									shouldWrap
									value="You have matched one of your import columns to an existing date column. Please specify the date format of the import column."
								/>
							</Padding>
						</Stack>
						<Stack spacing="sm">
							<label htmlFor={dateFormatId}>Date format</label>
							<Select
								id={dateFormatId}
								value={dateFormat ?? ""}
								onChange={(value) =>
									onDateFormatChange(
										(value as DateFormat) || null
									)
								}
							>
								<option value="">Select an option</option>
								{Object.values(DateFormat)
									.filter(
										(format) =>
											format !== DateFormat.RELATIVE &&
											format !== DateFormat.FULL
									)
									.map((format) => (
										<option key={format} value={format}>
											{getDisplayNameForDateFormat(
												format
											)}
										</option>
									))}
							</Select>
						</Stack>
						<Stack spacing="sm">
							<label htmlFor={dateFormatSeparatorId}>
								Date format separator
							</label>
							<Select
								id={dateFormatSeparatorId}
								value={dateFormatSeparator ?? ""}
								onChange={(value) =>
									onDateFormatSeparatorChange(
										(value as DateFormatSeparator) || null
									)
								}
							>
								<option value="">Select an option</option>
								{Object.values(DateFormatSeparator).map(
									(format) => (
										<option key={format} value={format}>
											{format}
										</option>
									)
								)}
							</Select>
						</Stack>
						<Stack spacing="sm">
							<label htmlFor={importColumnDateFormat}>
								Import column date format
							</label>
							<Text
								variant="semibold"
								size="sm"
								value={exampleDateFormat}
							/>
						</Stack>
					</Stack>
				</>
			)}
		</div>
	);
}

const getExampleDateFormat = (
	format: DateFormat,
	separator: DateFormatSeparator
) => {
	const day = "01";
	const month = "12";
	const year = "2023";

	var dateString = "";

	switch (format) {
		case DateFormat.MM_DD_YYYY:
			dateString = month + separator + day + separator + year;
			break;
		case DateFormat.DD_MM_YYYY:
			dateString = day + separator + month + separator + year;
			break;
		case DateFormat.YYYY_MM_DD:
			dateString = year + separator + month + separator + day;
			break;
		default:
			throw new Error(`Unexpected date format: ${format}`);
	}

	return dateString;
};
