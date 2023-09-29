import { useOverflow } from "src/shared/spacing/hooks";
import "./styles.css";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
}

export default function SourceCell({ value, shouldWrapOverflow }: Props) {
	const overflowClassName = useOverflow(shouldWrapOverflow);

	let className = "dataloom-source-cell";
	className += " " + overflowClassName;

	return <div className={className}>{value}</div>;
}
