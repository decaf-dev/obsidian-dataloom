import Submenu from "./submenu";

import {
	AspectRatio,
	CellType,
	CurrencyType,
	DateFormat,
	PaddingSize,
} from "src/shared/types";
import Stack from "src/react/shared/stack";
import Padding from "src/react/shared/padding";
import MenuItem from "src/react/shared/menu-item";
import { SubmenuType } from "./types";
import {
	getDisplayNameForCurrencyType,
	getDisplayNameForDateFormat,
} from "src/shared/loom-state/display-name";

interface Props {
	title: string;
	currencyType: CurrencyType;
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
				<Stack spacing="lg">
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
					{type === CellType.CURRENCY && (
						<MenuItem
							name="Currency"
							value={getDisplayNameForCurrencyType(currencyType)}
							onClick={() =>
								onSubmenuChange(SubmenuType.CURRENCY)
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
