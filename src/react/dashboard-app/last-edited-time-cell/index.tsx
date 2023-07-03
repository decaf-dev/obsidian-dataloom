import { unixTimeToDateTimeString } from "src/shared/date/date-conversion";
import { useOverflow } from "src/shared/spacing/hooks";
import { DateFormat } from "src/shared/types";

interface Props {
	value: number;
	format: DateFormat;
	shouldWrapOverflow: boolean;
}

export default function LastEditedTimeCell({
	value,
	format,
	shouldWrapOverflow,
}: Props) {
	const overflowStyle = useOverflow(shouldWrapOverflow);
	return (
		<div className="Dashboards__last-edited-time-cell" css={overflowStyle}>
			{unixTimeToDateTimeString(value, format)}
		</div>
	);
}
