import "react-datepicker/dist/react-datepicker.css";

import "./styles.css";
import MenuItem from "src/components/MenuItem";
import { useEffect, useState } from "react";
import Stack from "src/components/Stack";
import Padding from "src/components/Padding";
import { isValidDateFormat } from "src/services/date/utils";
import { DateFormat } from "src/services/tableState/types";
import { useCompare } from "src/services/hooks";

interface Props {
	value: string;
	closeMenuRequestTime: number | null;
	dateFormat: DateFormat;
	onDateChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function DateCellEdit({
	value,
	closeMenuRequestTime,
	dateFormat,
	onDateChange,
	onMenuClose,
}: Props) {
	const [localValue, setLocalValue] = useState(value);
	const [isInputInvalid, setInputInvalid] = useState(false);
	const [closeTime, setCloseTime] = useState(0);

	const didCloseMenuRequestTimeChange = useCompare(closeMenuRequestTime);
	useEffect(() => {
		function validateInput() {
			//If the user has not entered a value, we don't need to validate the date format
			if (localValue !== "") {
				if (!isValidDateFormat(localValue, dateFormat)) {
					setInputInvalid(true);
					return;
				}
			}

			setInputInvalid(false);
			onDateChange(localValue);
			setCloseTime(Date.now());
		}

		if (didCloseMenuRequestTimeChange && closeMenuRequestTime !== null)
			validateInput();
	}, [didCloseMenuRequestTimeChange, localValue, closeMenuRequestTime]);

	//If we call onMenuClose directly in the validateInput function, we can see the cell markdown
	//change to the new value as the menu closes
	//If we call onMenuClose in a useEffect, we wait an entire render cycle before closing the menu
	//This allows us to see the cell markdown change to the new value before the menu closes
	useEffect(() => {
		if (closeTime !== 0) {
			onMenuClose();
		}
	}, [closeTime]);

	return (
		<div className="NLT__date-cell-edit">
			<Stack spacing="md" isVertical>
				<Padding px="md" py="md">
					<input
						aria-invalid={isInputInvalid}
						autoFocus
						value={localValue}
						onChange={(e) => setLocalValue(e.target.value)}
					/>
				</Padding>
				<MenuItem name="Clear" onClick={() => setLocalValue("")} />
			</Stack>
		</div>
	);
}
