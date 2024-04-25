import Submenu from "../../shared/submenu";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	DateFormatSeparator,
	NumberFormat,
	PaddingSize,
	SortDir
} from "src/shared/loom-state/types/loom-state";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import { SubmenuType } from "./types";
import {
	getDisplayNameForCurrencyType,
	getDisplayNameForDateFormat,
	getDisplayNameForDateFormatSeparator,
} from "src/shared/loom-state/type-display-names";

interface Props {
	title: string;
	hour12: boolean;
	currencyType: CurrencyType;
	numberFormat: NumberFormat;
	numberPrefix: string;
	numberSuffix: string;
	numberSeparator: string;
	dateFormatSeparator: DateFormatSeparator;
	type: CellType;
	dateFormat: DateFormat;
	verticalPadding: PaddingSize;
	horizontalPadding: PaddingSize;
	aspectRatio: AspectRatio;
	contentsSortDir: SortDir;
	onBackClick: () => void;
	onSubmenuChange: (value: SubmenuType) => void;
}

export default function OptionSubmenu({
	type,
	hour12,
	currencyType,
	numberFormat,
	numberPrefix,
	numberSuffix,
	numberSeparator,
	aspectRatio,
	dateFormatSeparator,
	verticalPadding,
	horizontalPadding,
	title,
	dateFormat,
	contentsSortDir,
	onBackClick,
	onSubmenuChange,
}: Props) {
	const numberFormatDisplayName =
		numberFormat === NumberFormat.NUMBER
			? "Number"
			: getDisplayNameForCurrencyType(currencyType);

	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding pt="sm" pb="lg">
				<Stack spacing="sm">
					{type === CellType.EMBED && (
						<MenuItem
							name="Aspect ratio"
							value={aspectRatio}
							onClick={() =>
								onSubmenuChange(SubmenuType.ASPECT_RATIO)
							}
						/>
					)}
					{type === CellType.EMBED && (
						<MenuItem
							name="Horizontal padding"
							value={horizontalPadding}
							onClick={() =>
								onSubmenuChange(SubmenuType.HORIZONTAL_PADDING)
							}
						/>
					)}
					{type === CellType.EMBED && (
						<MenuItem
							name="Vertical padding"
							value={verticalPadding}
							onClick={() =>
								onSubmenuChange(SubmenuType.VERTICAL_PADDING)
							}
						/>
					)}
					{type === CellType.NUMBER && (
						<MenuItem
							name="Number format"
							value={numberFormatDisplayName}
							onClick={() =>
								onSubmenuChange(SubmenuType.CURRENCY)
							}
						/>
					)}
					{type === CellType.NUMBER &&
						numberFormat == NumberFormat.NUMBER && (
							<MenuItem
								name="Prefix"
								value={numberPrefix}
								onClick={() =>
									onSubmenuChange(
										SubmenuType.TEXT_INPUT_NUMBER_PREFIX
									)
								}
							/>
						)}
					{type === CellType.NUMBER &&
						numberFormat == NumberFormat.NUMBER && (
							<MenuItem
								name="Suffix"
								value={numberSuffix}
								onClick={() =>
									onSubmenuChange(
										SubmenuType.TEXT_INPUT_NUMBER_SUFFIX
									)
								}
							/>
						)}
					{type === CellType.NUMBER &&
						numberFormat == NumberFormat.NUMBER && (
							<MenuItem
								name="Separator"
								value={numberSeparator}
								onClick={() =>
									onSubmenuChange(
										SubmenuType.TEXT_INPUT_NUMBER_SEPARATOR
									)
								}
							/>
						)}
					{(type === CellType.CREATION_TIME ||
						type === CellType.LAST_EDITED_TIME) && (
						<>
							<MenuItem
								name="Date format"
								value={getDisplayNameForDateFormat(dateFormat)}
								onClick={() =>
									onSubmenuChange(SubmenuType.DATE_FORMAT)
								}
							/>
							<MenuItem
								name="Date separator"
								value={getDisplayNameForDateFormatSeparator(
									dateFormatSeparator
								)}
								onClick={() =>
									onSubmenuChange(
										SubmenuType.DATE_FORMAT_SEPARATOR
									)
								}
							/>
							<MenuItem
								name="Time format"
								value={hour12 ? "12 hour" : "24 hour"}
								onClick={() =>
									onSubmenuChange(SubmenuType.TIME_FORMAT)
								}
							/>
						</>
					)}
					{type === CellType.MULTI_TAG && (
						<MenuItem
							name="Contents sorting"
							value={contentsSortDir}
							onClick={() =>
								onSubmenuChange(SubmenuType.CONTENTS_SORT_DIR)
							}
						/>
					)}
				</Stack>
			</Padding>
		</Submenu>
	);
}
