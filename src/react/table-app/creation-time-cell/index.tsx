import { useOverflow } from "src/shared/spacing/hooks";
import { DateFormat } from "src/shared/types";
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
	const overflowStyle = useOverflow(shouldWrapOverflow);
	return (
		<div className="Dashboards__creation-time-cell" css={overflowStyle}>
			{unixTimeToDateTimeString(value, format)}
		</div>
	);
}
