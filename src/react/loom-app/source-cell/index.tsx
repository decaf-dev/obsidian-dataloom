import { useOverflow } from "src/shared/spacing/hooks";
import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
}

export default function SourceCell({
	value: originalValue,
	shouldWrapOverflow,
}: Props) {
	const overflowClassName = useOverflow(shouldWrapOverflow);

	let className = "dataloom-source-cell";
	className += " " + overflowClassName;

	let value = originalValue;
	if (value === "") {
		value = "Internal";
	}

	return <div className={className}>{value}</div>;
}
