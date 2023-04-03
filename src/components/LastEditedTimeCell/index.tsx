import { useOverflowClassname } from "src/services/spacing/hooks";
import { dateTimeToString } from "src/services/string/conversion";

interface Props {
	time: number;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export default function LastEditedTimeCell({
	time,
	useAutoWidth,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassname(
		useAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__last-edited-time-cell" + " " + overflowClass;

	return <div className={className}>{dateTimeToString(time)}</div>;
}
