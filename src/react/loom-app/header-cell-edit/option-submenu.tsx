import Submenu from "../../shared/submenu";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	NumberFormat,
	PaddingSize,
} from "src/shared/loom-state/types/loom-state";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import { SubmenuType } from "./types";
import {
	getDisplayNameForCurrencyType,
	getDisplayNameForDateFormat,
} from "src/shared/loom-state/type-display-names";

interface Props {
	title: string;
	currencyType: CurrencyType;
	numberFormat: NumberFormat;
	numberPrefix: string;
	numberSuffix: string;
	numberSeparator: string;
	type: CellType;
	dateFormat: DateFormat;
	verticalPadding: PaddingSize;
	horizontalPadding: PaddingSize;
	aspectRatio: AspectRatio;
	onBackClick: () => void;
	onSubmenuChange: (value: SubmenuType) => void;
}

export default function OptionSubmenu({
	type,
	currencyType,
	numberFormat,
	numberPrefix,
	numberSuffix,
	numberSeparator,
	aspectRatio,
	verticalPadding,
	horizontalPadding,
	title,
	dateFormat,
	onBackClick,
	onSubmenuChange,
}: Props) {
	return (
		<Submenu title={title} onBackClick={onBackClick}>
			<Padding pt="sm" pb="lg">
				<Stack spacing="sm">
					{type === CellType.EMBED && (
						<MenuItem
							name="Aspect Ratio"
							value={aspectRatio}
							onClick={() =>
								onSubmenuChange(SubmenuType.ASPECT_RATIO)
							}
						/>
					)}
					{type === CellType.EMBED && (
						<MenuItem
							name="Horizontal Padding"
							value={horizontalPadding}
							onClick={() =>
								onSubmenuChange(SubmenuType.HORIZONTAL_PADDING)
							}
						/>
					)}
					{type === CellType.EMBED && (
						<MenuItem
							name="Vertical Padding"
							value={verticalPadding}
							onClick={() =>
								onSubmenuChange(SubmenuType.VERTICAL_PADDING)
							}
						/>
					)}
					{type === CellType.NUMBER && (
						<MenuItem
							name="Number format"
							value={
								numberFormat === NumberFormat.NUMBER
									? "Number"
									: getDisplayNameForCurrencyType(
											currencyType
									  )
							}
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
						type === CellType.LAST_EDITED_TIME ||
						type === CellType.DATE) && (
						<MenuItem
							name="Date format"
							value={getDisplayNameForDateFormat(dateFormat)}
							onClick={() =>
								onSubmenuChange(SubmenuType.DATE_FORMAT)
							}
						/>
					)}
				</Stack>
			</Padding>
		</Submenu>
	);
}
