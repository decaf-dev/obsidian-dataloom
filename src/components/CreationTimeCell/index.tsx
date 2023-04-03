import { useOverflowClassname } from "src/services/spacing/hooks";
import { dateTimeToString } from "src/services/string/conversion";

interface Props {
	time: number;
	useAutoWidth: boolean;
	shouldWrapOverflow: boolean;
}

export default function CreationTimeCell({
	time,
	useAutoWidth,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflowClassname(
		useAutoWidth,
		shouldWrapOverflow
	);
	const className = "NLT__creation-time-cell" + " " + overflowClassName;

	return <div className={className}>{dateTimeToString(time)}</div>;
}
