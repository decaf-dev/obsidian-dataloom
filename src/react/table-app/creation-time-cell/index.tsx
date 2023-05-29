import { useOverflowClassName } from "src/shared/spacing/hooks";
import { DateFormat } from "src/shared/types/types";
import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";

interface Props {
	value: number;
	format: DateFormat;
	shouldWrapOverflow: boolean;
}

export default function CreationTimeCell({
	value,
	format,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassName(shouldWrapOverflow);
	const className = "NLT__creation-time-cell" + " " + overflowClassName;

	return (
		<div className={className}>
			{unixTimeToDateTimeString(value, format)}
		</div>
	);
}
